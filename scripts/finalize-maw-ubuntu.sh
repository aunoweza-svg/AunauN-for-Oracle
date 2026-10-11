#!/usr/bin/env bash
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

profile='/home/aunaun/.profile'
marker='# AunauN maw toolchain'
if ! grep -qxF "$marker" "$profile"; then
  cat >> "$profile" <<'PROFILE'

# AunauN maw toolchain
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$PATH"
PROFILE
fi

chown aunaun:aunaun "$profile"
chown -R aunaun:aunaun /home/aunaun/.local

echo 'PROFILE_SETUP_OK'
