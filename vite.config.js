import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: projectRoot,
  base: '/Music-Boxd/',              //important for project pages
  server: {
    port: 5173,
    open: false,
    host: 'localhost'
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    extensions: ['.js', '.json']
  }
});
