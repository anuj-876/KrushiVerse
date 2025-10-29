// Production environment configuration for frontend

// Create this file: KrushiVerse/.env.production
VITE_API_URL=https://your-backend-url.railway.app

// For local development: KrushiVerse/.env.development
VITE_API_URL=http://127.0.0.1:8002

// Update KrushiVerse/vite.config.js to use environment variables:
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
  }
})
