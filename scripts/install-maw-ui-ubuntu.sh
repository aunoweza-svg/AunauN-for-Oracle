#!/usr/bin/env bash
set -euo pipefail

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$PATH"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

release_json="$(curl -fsSL https://api.github.com/repos/Soul-Brews-Studio/maw-ui/releases/latest)"
tag="$(printf '%s' "$release_json" | jq -r '.tag_name')"
asset_url="$(printf '%s' "$release_json" | jq -r '.assets[] | select(.name == "maw-ui-dist.tar.gz" or (.name | endswith("dist.tar.gz"))) | .browser_download_url' | head -1)"

if [[ -z "$asset_url" ]]; then
  echo "No maw-ui dist archive was found in release $tag." >&2
  exit 1
fi

curl -fsSL "$asset_url" -o "$tmpdir/dist.tar.gz"
install_dir="$HOME/.maw/ui/dist"
mkdir -p "$install_dir"
tar -xzf "$tmpdir/dist.tar.gz" -C "$install_dir" --strip-components=1

echo "MAW_UI_INSTALLED=$tag"
maw ui status
