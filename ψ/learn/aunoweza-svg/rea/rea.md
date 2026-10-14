# REA — installed fork

## Installation — 2026-10-14

- Requested repository: https://github.com/aunoweza-svg/rea
- Source commit: `569ef4159db73931717825302b323fae7aa91bbf` (same commit as the previously reviewed upstream checkout).
- Installed source: `D:/OneDrive/เดสก์ท็อป/Workshop MD File/.learn-sources/aunoweza-svg/rea`
- Runtime: source-built REA 6.5.0, locked dependencies installed with `npm ci`, built with `npm run build:cached`.
- Node: portable 24.18.0 from nodejs.org, archive SHA256 checked against its release SHASUMS256.txt; stored under `.learn-sources/toolchain/node-v24.18.0-win-x64`.
- Windows native component: extracted from the npm `rea-agents@6.5.0` release. Artifact SHA256 `665c57ab90aef0712a6aafc423c7992a88bf608bea63b370cb30c695900f9aed` matches its bundled manifest. Runtime validates version, architecture, hash and native inspection.
- Codex MCP configuration: `C:/Users/aunow/.codex/config.toml`.
- Configuration backup: `C:/Users/aunow/.codex/config.toml.rea.backup`.
- Skill: `C:/Users/aunow/.agents/skills/reverse-engineer-anything`, version 42.

REA is a CLI and MCP server with a workflow skill. The AI agent calls its tools; installation does not create an autonomous agent.

## Validation

- Build: 3 tasks passed.
- Scoped setup: `ready`; Codex registration and skill reported aligned.
- Production stdio MCP smoke check: initialize passed; 207 tools and 6 prompts matched; server identity and `binary_session` request passed.
- Static JavaScript smoke check on a purpose-built two-file fixture: exit 0, Evidence confidence `derived`. Target JavaScript was parsed without execution. This validates the small static workflow, not all REA providers.
- CLI launcher: `rea.cmd --version` returned 6.5.0.

Full local reports are under `.learn-sources/rea-codex-setup-plan.json`, `rea-codex-setup-result.json`, `rea-codex-doctor.json`, `rea-mcp-smoke.json`, and `rea-javascript-smoke.json`.

## Use

Restart Codex to connect the new MCP server; the installed skill can be discovered on the next turn. MCP availability in this existing session has not been established.

From the workspace in PowerShell:

```powershell
.\rea.cmd --help
.\rea.cmd analyze-javascript-application "D:/apps/example" --json
```

The registration uses absolute paths to this workspace. Keep the source and portable Node directories in place; rerun scoped setup if the workspace moves. The launcher works without adding Node or REA to global PATH.

Ghidra, IDA, Hopper and JADX were not configured. Native decompilation and Android code analysis require their specific providers; missing optional engines do not block the verified static JavaScript workflow.

## Prior source review

[Upstream architecture, snippets and quick reference](../../morluto/rea/rea.md)
