import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  root: './demo',
  base: process.env.PUBLIC_BASE_URL || process.env.BASE_URL || '/',
  server: {
    port: 3000,
  },
  build: {
    outDir: '../dist',
  },
});
