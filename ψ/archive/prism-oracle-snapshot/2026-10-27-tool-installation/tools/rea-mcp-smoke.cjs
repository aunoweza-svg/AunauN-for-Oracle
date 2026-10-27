const { spawn } = require('node:child_process');
const path = require('node:path');
const server = path.resolve(__dirname, 'rea/node_modules/rea-agents/scripts/rea.mjs');
const child = spawn(process.execPath, [server, 'mcp'], { stdio: ['pipe', 'pipe', 'pipe'] });
let buffer = '';
let done = false;
let stderr = '';
const send = (message) => child.stdin.write(JSON.stringify(message) + '\n');
const timer = setTimeout(() => finish(1, 'timeout'), 20000);
function finish(code, message) {
  if (done) return;
  done = true;
  clearTimeout(timer);
  child.kill();
  process.stdout.write(JSON.stringify({ok: code === 0, message, stderr: stderr.slice(0, 400)}) + '\n');
  process.exitCode = code;
}
child.on('error', (error) => finish(1, error.message));
child.on('exit', (code) => { if (!done) finish(1, `server exited: ${code}`); });
child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
child.stdout.on('data', (chunk) => {
  buffer += chunk.toString();
  let newline;
  while ((newline = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, newline);
    buffer = buffer.slice(newline + 1);
    let reply;
    try { reply = JSON.parse(line); } catch { continue; }
    if (reply.id === 1 && reply.result) {
      send({jsonrpc:'2.0', method:'notifications/initialized'});
      send({jsonrpc:'2.0', id:2, method:'tools/list', params:{}});
    } else if (reply.id === 2 && reply.result) {
      finish(0, `initialize passed; ${reply.result.tools.length} tools listed`);
    } else if (reply.error) finish(1, reply.error.message);
  }
});
send({jsonrpc:'2.0', id:1, method:'initialize', params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'prism-smoke',version:'1.0'}}});
