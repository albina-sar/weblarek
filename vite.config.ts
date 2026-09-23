import { defineConfig } from 'vite'

export default defineConfig({
  base: '/web-larek-project/',
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
})