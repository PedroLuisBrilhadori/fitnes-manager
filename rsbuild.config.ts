import { loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'path';

const { publicVars } = loadEnv({ prefixes: ['VITE_'] });

export default {
  plugins: [pluginReact()],
  source: {
    define: publicVars,
    entry: {
      index: './src/index.tsx',
    },
  },
  resolve: {
    '@': path.resolve(__dirname, './src'),
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};
