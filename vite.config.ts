import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';
import vitApp from '@vitjs/vit';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    PkgConfig(),
    OptimizationPersist(),
    vitApp({
      routes: [
        {
          path: '/',
          component: './Home',
        },
      ],
    }),
  ],
});
