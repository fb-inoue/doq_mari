import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'ドクターまりおもどき',
  },
  source: {
    alias: {
      '@': './src',
    },
  },
  dev: {
    port: 3000,
  },
  output: {
    distPath: {
      root: 'docs',
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/doq_mari/' : '/',
  },
});
