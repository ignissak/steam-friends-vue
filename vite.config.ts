import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_DEVTOOLS__: true,
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  preview: {
    port: 4178,
    allowedHosts: true,
  },
  server: {
    port: 4178,
    allowedHosts: true,
  }
})
