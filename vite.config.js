import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Enable CORS for all origins during development
    cors: true,
    // Add headers to help with debugging
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
    // Enable source maps for better debugging
    sourcemap: true,
  },
  // Enable detailed logging
  logLevel: 'info',
})
