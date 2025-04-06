import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()


import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {  // ✅ Proxy should be inside the "server" object

    https: true,
    proxy:{
      '/api':{
          target:process.env.VITE_API,
          changeOrigin:true,
          rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});