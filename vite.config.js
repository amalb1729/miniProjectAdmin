import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {  // ✅ Proxy should be inside the "server" object
    proxy:{
      '/api':{
          target:process.env.VITE_API,
          changeOrigin:true,
          rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});