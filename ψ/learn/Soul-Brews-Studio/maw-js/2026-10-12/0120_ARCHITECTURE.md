# maw-js Architecture

## Executive summary

`maw-js` is a Bun/TypeScript command-line and backend system for orchestrating AI-agent processes. Its control plane is extensible (CLI routing, plugin manifests, HTTP API, multiple message transports), but its local execution plane is explicitly built around Unix shell commands and `tmux`. The repository does not document native Windows as a supported platform. For a Windows machine, the architecture points to **WSL2 as the practical host**: install Bun, `tmux`, Git/SSH and the agents inside Linux, then access the HTTP UI from Windows.

Evidence: the project describes itself as a CLI that wakes agents in tmux windows (`README.md:7-11`); the contributor requirements name Bun 1.3+ and tmux (`CONTRIBUTING.md:13`); local command execution always launches `bash -c` (`src/core/transport/ssh.ts:105-117`).

## Repository layout

The source tree is split by responsibility:

| Path | Architectural role | Evidence |
|---|---|---|
| `src/cli.ts` and `src/cli/` | Executable entry point, argument handling, command discovery, aliases, and dispatch | `package.json:10-12`; `src/cli.ts:21-64`; `src/cli/dispatch.ts:17-53` |
| `src/commands/` | Command implementations, divided into shared logic and plugin-facing handlers | Repository tree; upstream overview at `README.md:251-261` |
| `src/api/` | Elysia HTTP API modules for sessions, fleet, federation, plugins, workspaces, engine status, etc. | `src/api/index.ts:1-78` |
| `src/engine/` | Runtime/serve coordination; described upstream as WebSocket and serve proxy | `README.md:254-260` |
| `src/core/` | Reusable domain and infrastructure primitives: paths, fleet, matching, consent, gateway, transport | Public exports in `package.json:80-95` |
| `src/transports/` | Concrete tmux, HTTP, Scout, Zenoh, and NanoClaw transport adapters | `src/transports/index.ts:5-14,52-114` |
| `src/config/` | Layered configuration, validation, engine definitions, and defaults | `src/config.ts:1-8`; `src/config/load.ts:27-37` |
| `src/plugin/` | Manifest/package discovery, validation, dependencies, lifecycle and invocation | `src/plugin/registry.ts:1-20,132-180` |
| `src/plugins/` | A smaller hook-oriented TS/JS/WASM plugin pipeline with ordered boot modules | `src/plugins/index.ts:1-16`; `src/plugins/20_loader.ts:73-108` |
| `src/vendor/` and `src/vendor-plugins/` | Bundled command/API/lifecycle plugin surfaces | Repository tree; `README.md:259` |
| `src/sdk/`, `packages/sdk/` | Public SDK surface for integrations and plugin authors | `package.json:68-129` and workspace declaration at `package.json:7-9` |
| `src/wasm/`, `examples/` | Rust/AssemblyScript plugin SDKs and examples | Repository tree |
| `test/` | Unit, isolated, integration, security, fixture/spec, and federation tests | `CONTRIBUTING.md:27-42` |
| `ui/`, `demo/`, `src/static/` | Small static/demo surfaces; the main React UI is a separate repository | `README.md:53-87,140-152` |
| `packages/maw-gateway/` | A Rust gateway subproject | Repository tree (`Cargo.toml`, `src/main.rs`) |

## Entry points and boot flow

The installed binary `maw` maps directly to `src/cli.ts` (`package.json:10-12`). The production build compiles that file into a Bun-targeted single output, with Zenoh kept external because its WASM conflicts with single-file bundling (`package.json:13-15`; `src/transports/index.ts:14`).

The CLI boot sequence is:

1. Set `MAW_CLI`, apply an instance preset before stateful imports, and parse global verbosity flags (`src/cli.ts:1-30`).
2. Handle version/update early (`src/cli.ts:34-42`).
3. Bootstrap bundled/user plugins into the selected data directory and scan `.ts`, `.js`, and `.wasm` command modules (`src/cli.ts:44-53`; `src/cli/command-registry.ts:26-50`).
4. Optionally restore recent state, render help, or dispatch the command (`src/cli.ts:54-64`).
5. Dispatch proceeds through communication routes, tool routes, top-level aliases, the command registry, bundled plugin packages, and finally agent-name shorthand (`src/cli/dispatch.ts:17-53`).

The API is assembled as one Elysia router under `/api`, adding CORS, Swagger, federation authentication, core route modules, and plugin-declared API routes (`src/api/index.ts:1-78,80-112`). `maw serve` exposes the backend; the quick start states the default endpoint is port 3456 (`README.md:41-50`).

## Core abstractions

### 1. Agent processes as tmux sessions/windows/panes

The `Tmux` class is the central local process-control adapter. It builds `tmux` command lines and delegates them to `hostExec` (`src/core/transport/tmux-class.ts:58-75`). It models sessions, windows, and panes (`src/core/transport/tmux-types.ts:14-49`) and implements creation, listing, capture, key injection, selection, splitting, and cleanup across the rest of the class. A configurable socket can come from `MAW_TMUX_SOCKET` or config (`src/core/transport/tmux-types.ts:3-12`).

This abstraction is not an optional detail for full local orchestration: the default transport router always registers tmux as the local fast path (`src/transports/index.ts:52-62`), and the public workflow explicitly wakes and sends prompts into tmux windows (`README.md:7-11,156-182`).

### 2. Transport interface and router

`Transport` defines lifecycle, send, presence, feed, handler registration, reachability, and connection state (`src/core/transport/transport.ts:46-103`). `TransportRouter` registers implementations in priority order and attempts the first connected transport that can reach a target, with classified failover behavior (`src/core/transport/transport.ts:105-174`).

The default registry composes:

- tmux for local delivery;
- Scout for LAN discovery;
- optional Zenoh/Zenoh Scout;
- HTTP federation for configured peers;
- NanoClaw for external chat channels.

See `src/transports/index.ts:52-114`. HTTP federation itself is largely portable network and data logic, but its target discovery and final remote delivery still reason about peer tmux sessions/windows (`src/transports/http.ts:57-75`).

### 3. Plugin OS

There are two related extension layers:

- The command scanner dynamically imports loose `.ts`/`.js` modules or loads `.wasm` commands from a plugin directory (`src/cli/command-registry.ts:26-50`).
- The package registry discovers directories containing `plugin.json`, enforces SDK/version/hash boundaries, supports symlinked development installs, and memoizes discovery (`src/plugin/registry.ts:1-20,50-72,132-180`).

Plugin packages can expose CLI commands, API routes, hooks, serve processes, and module symbols. The API automatically mounts declared GET/POST surfaces unless they conflict with direct routes (`src/api/index.ts:80-112`). A separate ordered hook system loads TypeScript, JavaScript, shared-memory WASM, and WASI modules (`src/plugins/index.ts:1-16`; `src/plugins/20_loader.ts:8-108`).

### 4. Layered configuration and runtime state

Configuration supports user-global weighted files plus project-local `.maw` layers (`src/core/paths.ts:21-36,77-123`). Loading validates and deep-merges layers and tracks provenance (`src/config/load.ts:1-11,43-58`). Runtime directories are centralized behind `MAW_HOME`, explicit directory variables, legacy `~/.maw`, or opt-in XDG paths (`src/core/xdg.ts:15-65`).

### 5. Fleet/team/worktree model

At the product level, a team charter declares members, engines, worktrees, and prompts; workers get isolated Git worktrees and prompt injection through tmux `send-keys` (`README.md:204-224`). This separates source-code isolation (Git worktrees) from execution isolation (tmux panes/windows) and identity/routing (fleet configuration).

## Dependencies

### Runtime and build

- **Bun** is the runtime, package manager, test runner, and bundler. The repository requires Bun 1.3+ (`CONTRIBUTING.md:13`) and builds with `bun build --target=bun` (`package.json:14`).
- **Elysia**, `@elysiajs/cors`, `@elysiajs/swagger`, and TypeBox underpin the backend/API (`package.json:41-49`; `src/api/index.ts:1-3`).
- **Transport/network libraries** include Zenoh, MQTT, Hono, and internal HTTP/Scout adapters (`package.json:40,48-50`; `src/transports/index.ts:5-14`).
- **Frontend-related packages** include React, React DOM, Zustand, Three.js, Monaco, xterm, Vite, and Tailwind (`package.json:43-66`). The principal frontend nevertheless lives in `Soul-Brews-Studio/maw-ui` (`README.md:53-87`).
- **PM2**, Docker, `ghq`, GitHub CLI, Git, SSH, curl, and agent CLIs appear as operational/external tools rather than declared npm dependencies. Scripts explicitly use PM2, Docker and shell tooling (`package.json:15-33`; `README.md:20-24,58-87,282-295`).

## Platform boundary: native Windows vs WSL/Linux

### Unix/tmux-dependent pieces

The following are architecturally Unix-specific or require a Unix compatibility layer:

- The official installer is `#!/bin/bash`, installs to `~/.bun/bin`, writes a Bash wrapper, uses `chmod`, and assumes Unix PATH syntax (`install.sh:1-24,105-135,167-179`).
- Local process execution is hard-coded to `Bun.spawn(["bash", "-c", cmd])`; its PATH helper splits on `:` and injects `/opt/homebrew`, `/usr/local`, `/usr/bin`, and `/bin` (`src/core/transport/ssh.ts:90-117`). Native Windows PowerShell/cmd is not an alternative in this implementation.
- Local agent orchestration invokes a `tmux` executable through Bash (`src/core/transport/tmux-class.ts:58-75`). Session creation, pane splitting, capture, `send-keys`, attach/switch, team layout and wake flows therefore require tmux.
- Test, preflight, coverage and release commands call Bash scripts (`package.json:17-33`).
- The documented manual UI installation uses shell parameter expansion, `tar`, and symlinks (`README.md:71-87`).

Consequently, merely installing Bun for native Windows is insufficient for the full product. The code contains `windowsHide: true` when spawning (`src/core/transport/ssh.ts:112-117`), but that only hides a Windows child window; it does not replace the required Bash/tmux environment.

### Portable or mostly portable pieces

The following portions are written as ordinary Bun/TypeScript and do not inherently require tmux in their core logic:

- argument parsing, validation, matching, error classification, and much of config merging;
- Elysia HTTP routing, authentication, API schema composition, and static asset serving;
- plugin manifest parsing, package discovery, semver/hash checks, and TS/JS/WASM loading;
- message transport interfaces plus network-oriented Scout/Zenoh/HTTP code;
- React/UI assets and the separate browser frontend;
- pure fixture/spec modules deliberately designed without Bun mocks, tmux handles, or filesystem paths (`docs/testing/portable-core-spec.md:8`).

However, several higher-level APIs eventually inspect or control tmux. “Portable module” therefore does not mean “the complete CLI works natively on Windows.” The source provides no native-Windows executor or pane backend equivalent to `Tmux`.

### Recommended Windows deployment shape

```text
Windows 11
├── Browser / editor / GitHub Desktop (optional Windows-side tools)
└── WSL2 Ubuntu
    ├── Bun 1.3+
    ├── tmux + bash + git + openssh-client + curl
    ├── Claude Code / Codex / other chosen agent CLI
    └── maw-js
        ├── local tmux agent sessions
        └── Elysia API :3456 ── opened from Windows browser
```

This shape satisfies the repository's actual shell and tmux assumptions without modifying the code. Running maw inside WSL also keeps the repository, worktrees, Unix permissions, symlinks, and agent executables in the same environment. For best filesystem performance, the working repositories should normally live in the WSL Linux filesystem rather than under a mounted Windows drive; that recommendation is an operational inference, not a statement found in this repository.

## Architectural implications for a future native-Windows port

A true Windows port would require more than an installer change. The minimum seams to replace or generalize are:

1. `hostExec`: choose PowerShell/cmd or a direct argv-based runner instead of unconditional `bash -c` (`src/core/transport/ssh.ts:105-117`).
2. Local process/session backend: implement a Windows Terminal/ConPTY/session manager conforming to the capabilities currently concentrated in `Tmux` (`src/core/transport/tmux.ts:1-14`; `src/core/transport/tmux-class.ts:58-75`).
3. Local transport selection: stop assuming tmux is always the default local fast path (`src/transports/index.ts:52-62`).
4. Install/update/test scripts: supply cross-platform Bun scripts or PowerShell equivalents (`install.sh`; `package.json:17-33`).
5. Audit POSIX quoting, `/` paths, symlinks, signals, shell utilities and colon-separated PATH handling throughout plugins and commands.

The existing `Transport` interface is a useful starting seam for message delivery, but it is not by itself enough: wake, attach, pane layout, capture, team lifecycle and worktree commands directly depend on the tmux abstraction.

## Bottom line

The control-plane architecture is modular and much of its TypeScript is portable, but the defining local orchestration mechanism is Unix/tmux. On Windows today, **WSL2 is the compatible execution environment**. Native Windows support would be a substantial backend/runner project, not a configuration switch.
