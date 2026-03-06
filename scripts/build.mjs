import { build } from 'esbuild';
import { execSync } from 'child_process';
import { mkdirSync, rmSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const BUNDLE_DIR = join(DIST, 'bundle');

// Clean
rmSync(DIST, { recursive: true, force: true });
mkdirSync(BUNDLE_DIR, { recursive: true });

// Bundle with esbuild (demo mode — no Prisma)
console.log('⚙  Bundling with esbuild...');
await build({
  entryPoints: [join(ROOT, 'src/handler.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: join(BUNDLE_DIR, 'handler.js'),
  // Keep @prisma/client external as a safety net (not actually used in demo mode)
  external: ['@prisma/client', '.prisma/client'],
  minify: false,
  sourcemap: false,
  format: 'cjs',
});

// Create zip
console.log('⚙  Creating lambda.zip...');
execSync('zip -r ../lambda.zip .', { stdio: 'inherit', cwd: BUNDLE_DIR });

console.log('✅ Build complete → dist/lambda.zip');
