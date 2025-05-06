import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@UI': path.resolve(__dirname, './src/shared/UI'),
      '@services': path.resolve(__dirname, './src/app/api/services'),
      '@servicesTypes': path.resolve(__dirname, './src/app/api/types'),
      '@constants': path.resolve(__dirname, './src/app/constants'),
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    VitePWA({ registerType: 'autoUpdate' }),
  ],
  // server: {
  //   watch: {
  //     usePolling: true,
  //   },
  //   host: true, // needed for the Docker Container port mapping to work
  //   strictPort: true,
  //   port: 5000,
  // },
});
