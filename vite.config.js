import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@theme/tailwindcss' // หรือปลั๊กอินที่คุณใช้อยู่
import path from 'path'

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})