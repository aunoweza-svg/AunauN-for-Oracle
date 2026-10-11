#!/usr/bin/env bash
set -euo pipefail

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$PATH"

session='aunaun-maw-smoke'
server_log='/tmp/aunaun-maw-server.log'
server_pid=''

cleanup() {
  if [[ -n "$server_pid" ]] && kill -0 "$server_pid" 2>/dev/null; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
  tmux kill-session -t "$session" 2>/dev/null || true
}
trap cleanup EXIT

tmux new-session -d -s "$session" -n smoke
echo 'TMUX_SESSION_OK'
maw ls --compact

maw serve 3456 >"$server_log" 2>&1 &
server_pid="$!"

api_status='000'
for _ in $(seq 1 30); do
  api_status="$(curl -sS -o /tmp/aunaun-maw-api.json -w '%{http_code}' http://127.0.0.1:3456/api/config || true)"
  if [[ "$api_status" == '200' ]]; then
    break
  fi
  sleep 1
done

if [[ "$api_status" != '200' ]]; then
  echo "maw API failed with HTTP $api_status" >&2
  tail -80 "$server_log" >&2
  exit 1
fi
echo "MAW_API_HTTP=$api_status"

ui_status="$(curl -sS -o /tmp/aunaun-maw-ui.html -w '%{http_code}' http://127.0.0.1:3456/federation_2d.html || true)"
echo "MAW_UI_HTTP=$ui_status"
if [[ "$ui_status" != '200' ]]; then
  exit 1
fi

maw wake Soul-Brews-Studio/maw-js --dry-run
echo 'MAW_DRY_RUN_OK'
