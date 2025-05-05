import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// A vite plugin that remove all the specified console types in the production environment
// https://www.npmjs.com/package/vite-plugin-remove-console
import removeConsole from 'vite-plugin-remove-console'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), removeConsole()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@use "@/assets/scss/variables.scss" as *; @use "@/assets/scss/root-variables.scss" as *; @use "@/assets/scss/mixins.scss" as *;',
      },
    },
  },
})

// _root-variables
