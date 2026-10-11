#!/usr/bin/env bash
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

release_json="$(curl -fsSL https://api.github.com/repos/x-motemen/ghq/releases/latest)"
ghq_url="$(printf '%s' "$release_json" | jq -r '.assets[] | select(.name | test("linux_amd64\\.zip$")) | .browser_download_url' | head -1)"
if [[ -z "$ghq_url" ]]; then
  echo "Could not locate the latest ghq Linux amd64 asset." >&2
  exit 1
fi

curl -fsSL "$ghq_url" -o "$tmpdir/ghq.zip"
unzip -q "$tmpdir/ghq.zip" -d "$tmpdir/out"
ghq_bin="$(find "$tmpdir/out" -type f -name ghq | head -1)"
install -m 0755 "$ghq_bin" /usr/local/bin/ghq

npm install -g @openai/codex@latest

su - aunaun -c '
set -e
if [[ ! -x "$HOME/.bun/bin/bun" ]]; then
  curl -fsSL https://bun.sh/install | bash
fi
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$PATH"
if ! bun add -g github:Soul-Brews-Studio/maw-js; then
  echo "Global GitHub install could not resolve the workspace; falling back to the documented source install."
  ghq get -u https://github.com/Soul-Brews-Studio/maw-js
  cd "$(ghq root)/github.com/Soul-Brews-Studio/maw-js"
  bun install
  bun link
fi
grep -qxF '\''export BUN_INSTALL="$HOME/.bun"'\'' "$HOME/.bashrc" || {
  printf '\''\nexport BUN_INSTALL="$HOME/.bun"\nexport PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$PATH"\n'\'' >> "$HOME/.bashrc"
}
'

echo 'TOOL_SETUP_OK'
ghq --version
codex --version
su - aunaun -c 'export PATH="$HOME/.bun/bin:$HOME/.local/bin:$PATH"; bun --version; maw --version'
