import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    preact(),
    dts({
      insertTypesEntry: true,
      outDirs: 'dist/types',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ClackTerminal',
      formats: ['umd'],
      fileName: () => 'preact-clack-terminal.js',
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        globals: {
          preact: 'preact',
        },
      },
    },
    //  sourcemap: true,
    // minify: 'esbuild',
  },
});
