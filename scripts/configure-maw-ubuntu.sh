#!/usr/bin/env bash
set -euo pipefail

if [[ "$(id -un)" != 'aunaun' ]]; then
  echo "Run this script as aunaun." >&2
  exit 1
fi

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$PATH"

maw init --non-interactive --node aunaun-wsl --ghq-root /home/aunaun/ghq

echo 'CONFIG_OK'
jq '{node, host, port, ghqRoot}' "$HOME/.config/maw/maw.config.json"

maw ui install
maw ui status
