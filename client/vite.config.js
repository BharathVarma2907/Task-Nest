import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path configurable via env for Pages/Vercel
  base: process.env.VITE_BASE || '/',
  server: {
    port: 3000,
  },
})
