import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for deployment. 
  // If deploying to https://<USERNAME>.github.io/<REPO>/, set this to '/<REPO>/'
  // For Vercel or root domains, keep it as './' or '/'
  base: './', 
  server: {
    host: true,
    port: 5173
  }
})