import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => chạy được cả ở https://<user>.github.io/<repo>/ lẫn domain riêng.
export default defineConfig({
  base: './',
  plugins: [react()],
})
