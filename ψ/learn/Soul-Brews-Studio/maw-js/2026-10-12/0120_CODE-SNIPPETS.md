# maw-js: Core Code Snippets and Windows Portability Seams

Source inspected: `C:\Users\aunow\ghq\github.com\Soul-Brews-Studio\maw-js`

This document records only behavior verified in the source tree. The project is a Bun/TypeScript CLI whose local agent control path is built around tmux and Unix shell tools. Running the current implementation in WSL is therefore substantially closer to its native execution model than running it directly in Windows PowerShell or `cmd.exe`.

## 1. Main entry point

`package.json` maps the `maw` executable to `src/cli.ts` and builds the same file for the Bun target (`package.json:10-15`). The entry point:

```ts
#!/usr/bin/env bun
process.env.MAW_CLI = "1";

import { applyInstancePreset } from "./cli/instance-preset";
applyInstancePreset();
// ...
const rawArgs = process.argv.slice(2);
// ...
await runBootstrap(pluginDir, import.meta.dir);
await scanCommands(pluginDir, "user");
await maybeAutoRestore(cmd);
await dispatchCommand(cmd, args);
```

Location: `src/cli.ts:1-57`.

The order is intentional: instance environment is applied before modules that resolve state paths, then plugins are bootstrapped and scanned before dispatch. This means the CLI front door itself is not the main Windows blocker; most incompatibilities are below it in transport and process adapters.

## 2. Local shell execution is hard-coded to Bash

The central execution seam is `createSshTransport()`:

```ts
const args = local ? ["bash", "-c", cmd] : ["ssh", host, cmd];
const proc = io.spawn(args, {
  stdout: "pipe",
  stderr: "pipe",
  windowsHide: true,
  env: local ? { ...process.env, ...env, PATH: pathWithCommonLocalBins(env) } : undefined,
});
```

Location: `src/core/transport/ssh.ts:106-119`.

The same module constructs `PATH` by splitting and joining with `:` and prepends Unix directories such as `/usr/local/bin`, `/usr/bin`, and `/bin` (`src/core/transport/ssh.ts:89-103`). On native Windows, `PATH` uses `;`, and `bash` is not guaranteed to exist. Consequently, even though `Bun.spawn` itself supports Windows, the local command contract supplied to it is Unix-specific.

Useful seam: `createSshTransport(overrides)` already injects `spawn`, configuration, environment, and tmux creation through `SshDeps` (`src/core/transport/ssh.ts:33-86`). A Windows port can add a platform-aware local executor here without rewriting callers. However, callers pass shell command *strings* containing POSIX syntax, so changing only `bash` to PowerShell would not be sufficient.

## 3. tmux is the core local process/session backend

`Tmux.run()` builds a tmux command and delegates all execution to `hostExec`:

```ts
async run(subcommand: string, ...args: (string | number)[]): Promise<string> {
  const socketFlag = this.socket ? `-S ${q(this.socket)} ` : "";
  const needsTermFallback = !process.env.TERM && process.env.MAW_TEST_MODE !== "1";
  const termPrefix = needsTermFallback ? "TERM=xterm " : "";
  const cmd = `${termPrefix}tmux ${socketFlag}${subcommand} ${args.map(q).join(" ")}`;
  return hostExec(cmd, this.host);
}
```

Location: `src/core/transport/tmux-class.ts:54-61`.

The class is a reasonably clean API boundary. It encapsulates sessions, windows, panes, capture, resize, layouts, key delivery, and session environment. Representative methods include:

```ts
await this.run("new-session", ...args);
await this.run("new-window", ...args);
return this.run("capture-pane", "-t", target, "-e", "-p", "-S", -safeLines);
await this.run("send-keys", "-t", target, "-l", text);
```

Locations: `src/core/transport/tmux-class.ts` (`newSession`, `newWindow`, `capture`, and `sendKeysLiteral`).

Windows-native blocker: the project does not merely launch background processes; it depends on tmux semantics such as grouped sessions, panes, window IDs, `send-keys`, `capture-pane`, and tmux format expressions. Native Windows has no tmux implementation providing this contract.

Useful seam: preserve the higher-level session API but introduce a backend interface implemented by the current `Tmux` class and, later, a Windows backend. The repository already has a broader transport interface in `src/core/transport/transport.ts`, but many modules import the concrete `tmux` singleton, so full native support requires migrating those direct imports to an injected session/pane backend.

## 4. Web terminal/PTY bridge assumes Unix utilities

The PTY implementation explicitly handles Linux and macOS, but not Windows:

```ts
const cmd = `stty rows ${r} cols ${c} 2>/dev/null; TERM=xterm-256color ${io.tmuxCmd()} attach-session -t '${ptySessionName}'`;
if (io.platform() === "darwin") {
  args = ["/usr/bin/expect", "-c", `spawn -noecho sh -c "${esc}"; interact`];
} else {
  args = ["script", "-qfc", cmd, "/dev/null"];
}
```

Location: `src/core/transport/pty.ts:242-266`.

The non-Darwin branch includes Windows and assumes `stty`, `script`, `/dev/null`, `sh` semantics, and tmux. Therefore it cannot be treated as a generic fallback.

Useful seam: `PtyDeps` already injects `spawn`, `spawnSync`, `platform`, environment, timers, and tmux (`src/core/transport/pty.ts:5-48`). A Windows branch could be supplied here using a ConPTY-capable library or helper process. This is one of the cleanest existing seams in the repository.

## 5. tmux streaming assumes `tail` and `cat`

The server's streaming path launches Unix `tail` and asks tmux to pipe output through `cat`:

```ts
const child = Bun.spawn({
  cmd: ["tail", "-n", "0", "-f", path],
  stdout: "pipe",
  stderr: "inherit",
});
// ...
await deps.pipePane(paneId, `cat >> ${shellEscapeArg(file)}`, { onlyIfClosed: true });
```

Location: `src/api/tmux-stream.ts:71-77, 124-128`.

Windows-native blockers: stock Windows does not provide these commands, and the redirection string follows POSIX shell quoting. Useful seam: `spawnTail` and `pipePane` are already injectable through `TmuxStreamDeps` (`src/api/tmux-stream.ts:31-49, 165-173`). A portable implementation could replace file-following with Bun file watching/stream reads; replacing `pipe-pane` still depends on the broader session backend decision.

## 6. Other verified Unix assumptions

- Installer: `install.sh` is a Bash script and uses `curl`, `grep`, `cut`, `command -v`, `$HOME`, `chmod`, and shell wrapper generation (`install.sh:1-181`). There is no PowerShell installer in the inspected root file list.
- Test commands: the default, isolated, preflight, coverage, and release scripts invoke `bash` (`package.json:17-33`). Some inline scripts also use POSIX environment assignment such as `MAW_TEST_MODE=1 bun test`, which is not valid PowerShell syntax.
- Process details: serve status runs `ps -p ... -o ...` (`src/cli/instance-pid.ts:47-61`). Failure is caught, so status can still work but without the process summary.
- Auto-start setup: native Windows is explicitly rejected with `"maw setup auto-wake is only implemented for Linux/macOS service managers"` (`src/vendor/mpr-plugins/setup/auto-wake.ts:58-66`). The implementation uses `loginctl`, systemd-oriented `pm2 startup`, and PM2 (`src/vendor/mpr-plugins/setup/auto-wake.ts:75-80`).
- Repository discovery: `getGhqRoot()` shells out with `execSync("ghq root")` but falls back to `join(homedir(), "Code")` if the command fails (`src/config/ghq-root.ts:77-98`). This portion is comparatively portable if `ghq` is installed.
- Module-root conversion: `MAW_ROOT` uses `new URL(import.meta.url).pathname` rather than `fileURLToPath(import.meta.url)` (`src/core/paths.ts:5`). On Windows file URLs commonly carry a leading slash before the drive letter; this is a likely portability defect and should be covered with a Windows path test before changing it.

## 7. Networking is less coupled to the OS

The core transport model explicitly supports local tmux plus HTTP/MQTT/peer transports (`src/core/transport/transport.ts:4-15, 93-115`). The SSH executor also invokes commands as argument arrays (`["ssh", host, cmd]`) rather than concatenating the local process launch (`src/core/transport/ssh.ts:109`). Bun networking and the Elysia/API layers do not appear to be the first blockers. The difficult part is the local interactive-agent lifecycle.

An immediately useful Windows arrangement is therefore:

1. Run the current CLI and tmux-controlled agents inside WSL2, where Bash, tmux, PTY utilities, Unix paths, and the installer match the verified implementation.
2. Expose the HTTP/UI service to Windows via localhost.
3. Keep repositories in the WSL filesystem when performance and file-watching matter, or explicitly translate Windows/WSL paths at the boundary.

This is an operational compatibility route, not a native Windows port.

## 8. Practical native-Windows port sequence

Based on the verified seams, the least disruptive order is:

1. Add an OS abstraction for local command execution in `createSshTransport`; retain the current Bash executor as the Unix implementation.
2. Define a session/pane interface from the subset exposed by `Tmux`, then migrate concrete singleton imports to dependency injection.
3. Implement a Windows process/session backend (likely using ConPTY for interactive I/O). It must define equivalents or documented limitations for panes, capture, resize, key delivery, and lifecycle.
4. Add an explicit `win32` branch in `pty.ts`; never let Windows fall into the Linux `script -qfc` branch.
5. Replace `tail`/`cat` streaming with runtime-native file or process streams.
6. Add PowerShell installation and Windows-safe package scripts, then replace `ps`, systemd/loginctl, and file-URL/path assumptions.
7. Add Windows CI before advertising native support.

The source currently contains dependency-injection seams that make individual pieces testable, but no complete native-Windows backend is present.
