import { build } from 'esbuild';
import { execSync } from 'child_process';
import { mkdirSync, rmSync, cpSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { createWriteStream } from 'fs';
import { createGzip } from 'zlib';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const BUNDLE_DIR = join(DIST, 'bundle');

// Clean
rmSync(DIST, { recursive: true, force: true });
mkdirSync(BUNDLE_DIR, { recursive: true });

// Generate Prisma client
console.log('⚙  Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit', cwd: ROOT });

// Bundle with esbuild
console.log('⚙  Bundling with esbuild...');
await build({
  entryPoints: [join(ROOT, 'src/handler.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: join(BUNDLE_DIR, 'handler.js'),
  external: ['@prisma/client', '.prisma/client'],
  minify: false,
  sourcemap: false,
  format: 'cjs',
});

// Copy Prisma client and query engine
console.log('⚙  Copying Prisma client...');
const prismaClientSrc = join(ROOT, 'node_modules/.prisma');
const prismaClientDest = join(BUNDLE_DIR, 'node_modules/.prisma');
if (existsSync(prismaClientSrc)) {
  cpSync(prismaClientSrc, prismaClientDest, { recursive: true });
}

const prismaGeneratedSrc = join(ROOT, 'node_modules/@prisma/client');
const prismaGeneratedDest = join(BUNDLE_DIR, 'node_modules/@prisma/client');
if (existsSync(prismaGeneratedSrc)) {
  cpSync(prismaGeneratedSrc, prismaGeneratedDest, { recursive: true });
}

// Create zip
console.log('⚙  Creating lambda.zip...');
execSync('zip -r ../lambda.zip .', { stdio: 'inherit', cwd: BUNDLE_DIR });

console.log('✅ Build complete → dist/lambda.zip');
