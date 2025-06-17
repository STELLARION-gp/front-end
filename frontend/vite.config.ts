import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // This injects your global variables, mixins, etc. into every SCSS file automatically.
        additionalData: `
          @use "@/styles/abstracts/variables" as *;
          @use "@/styles/abstracts/mixins" as *;
        `,
      },
    },
  },
})
