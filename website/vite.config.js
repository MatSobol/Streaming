import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    include: "**/*.jsx",
  })],
  server: {
    watch: {
      usePolling: true
    },
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
