import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const devPort = parseInt(process.env.VITE_DEV_PORT || '5173', 10);

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],

  server: {
    port: devPort,
    strictPort: true, // Fail nếu port bị chiếm
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@page": path.resolve(__dirname, "./src/page"),
    },
  },
})
