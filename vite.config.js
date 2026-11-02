import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Content-hashed filenames: a new build never reuses an old cached URL, so a
// browser (or an old service worker) can never show a stale app again.
const PUBLIC_SHELL = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/logo-mark.png',
  '/fonts/plus-jakarta-sans-latin-wght-normal.woff2',
  '/img/hero-dashboard.jpg',
  '/img/measure-banner.jpg',
  '/img/measure-thumb.jpg',
];

function buildServiceWorker() {
  return {
    name: 'build-service-worker',
    writeBundle(_options, bundle) {
      const dir = resolve('site');
      const swFile = resolve(dir, 'sw.js');
      if (!existsSync(swFile)) throw new Error('sw.js missing from site/ — build order problem.');

      const assets = Object.keys(bundle)
        .filter(name => name.startsWith('assets/'))
        .sort()
        .map(name => '/' + name);
      const shell = ['/', '/index.html', ...assets, ...PUBLIC_SHELL];

      const hash = createHash('sha256').update(JSON.stringify(shell));
      for (const name of assets) {
        const file = resolve(dir, name);
        if (existsSync(file)) hash.update(readFileSync(file));
      }
      const version = hash.digest('hex').slice(0, 12);

      let source = readFileSync(swFile, 'utf8');
      if (!/const CACHE = 'am-dress-point-shell-v1';/.test(source)) throw new Error('sw.js cache placeholder not found.');
      if (!/^const SHELL = \[.*\];$/m.test(source)) throw new Error('sw.js SHELL placeholder not found.');
      source = source
        .replace("const CACHE = 'am-dress-point-shell-v1';", `const CACHE = 'am-dress-point-shell-${version}';`)
        .replace(/^const SHELL = \[.*\];$/m, `const SHELL = ${JSON.stringify(shell)};`);
      writeFileSync(swFile, source);
    },
  };
}

export default defineConfig({
  plugins: [buildServiceWorker()],
  server: { host: '127.0.0.1', proxy: { '/api': 'http://127.0.0.1:4174' } },
  build: {
    outDir: 'site',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
