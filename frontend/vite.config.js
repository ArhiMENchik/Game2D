import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8001',
        changeOrigin: true,
        secure: false,
      },
      '/ws_front': {
        target: 'ws://0.0.0.0:4041',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/media': {
        target: 'http://0.0.0.0:8001',
        changeOrigin: true,
        secure: false,
      },
    }
  },
})
