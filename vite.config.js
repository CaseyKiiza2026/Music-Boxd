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
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        album: fileURLToPath(new URL('./album.html', import.meta.url)),
        login: fileURLToPath(new URL('./login.html', import.meta.url)),
        profile: fileURLToPath(new URL('./profile.html', import.meta.url)),
      }
    }
  },
  resolve: {
    extensions: ['.js', '.json']
  }
});
