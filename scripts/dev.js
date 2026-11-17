import { spawn } from 'node:child_process';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const apiPort = Number(process.env.API_PORT || 3001);
const webPort = Number(process.env.PORT || 3000);
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];
let stopping = false;

function start(name, workspace, environment) {
  const child = spawn(npm, ['run', 'dev', '--workspace', workspace], {
    cwd: root,
    env: { ...process.env, ...environment },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  children.push(child);
  child.on('error', (error) => {
    console.error(`[${name}] failed to start: ${error.message}`);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping && code !== 0) {
      console.error(`[${name}] exited with ${signal || code}`);
      stop(code || 1);
    }
  });
}

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(exitCode), 300).unref();
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

start('api', 'backend', {
  PORT: String(apiPort),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || `http://localhost:${webPort}`,
});
start('web', 'frontend', {
  PORT: String(webPort),
  API_PROXY_URL: process.env.API_PROXY_URL || `http://127.0.0.1:${apiPort}`,
  VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || '/api',
});

console.log(`ChromaLens development stack: web :${webPort}, API :${apiPort}`);
