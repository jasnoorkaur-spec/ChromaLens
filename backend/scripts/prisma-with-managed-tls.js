import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { withManagedTiDBTls } from '../src/config/databaseUrl.js';

const require = createRequire(import.meta.url);
const prismaCli = require.resolve('prisma/build/index.js');
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required for this Prisma command.');
  process.exit(1);
}

const result = spawnSync(process.execPath, [prismaCli, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: { ...process.env, DATABASE_URL: withManagedTiDBTls(databaseUrl) },
  stdio: 'inherit',
});
if (result.error) {
  console.error(`Could not start Prisma: ${result.error.message}`);
  process.exit(1);
}
process.exitCode = result.status ?? 1;
