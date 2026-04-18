import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('@tonconnect')) return 'ton-vendor'
            if (id.includes('react-dom')) return 'react-vendor'
            if (id.includes('react')) return 'react-vendor'
            return 'vendor'
          }
        },
      },
    },
  },
})
