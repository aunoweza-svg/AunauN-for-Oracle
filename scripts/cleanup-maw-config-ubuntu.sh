#!/usr/bin/env bash
set -euo pipefail

for config in "$HOME"/.config/maw/maw.config*.json; do
  [[ -f "$config" ]] || continue
  tmp="$(mktemp)"
  jq 'del(.ghqRoot) | .commands = ((.commands // {}) + {"default": "codex"})' "$config" > "$tmp"
  cat "$tmp" > "$config"
  rm -f "$tmp"
done

echo 'MAW_CONFIG_CLEAN'
