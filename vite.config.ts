import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],

  server: {
    middlewareMode: false,
    // Đảm bảo port được log để Electron biết
    hmr: {
      protocol: 'http',
      host: 'localhost',
      port: 5173,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@page": path.resolve(__dirname, "./src/page"),
    },
  },
})
