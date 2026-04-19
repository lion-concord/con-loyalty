import { defineConfig, type Alias } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isRuStore = mode === 'rustore'

  const alias: Alias[] = isRuStore
    ? [
        {
          find: '@tonconnect/ui-react',
          replacement: path.resolve(__dirname, 'src/shims/tonconnect-empty.tsx'),
        },
        {
          find: /^\.\/WalletPanel$/,
          replacement: path.resolve(__dirname, 'src/shims/walletpanel-empty.tsx'),
        },
      ]
    : []

  return {
    plugins: [react()],
    resolve: { alias },
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
  }
})
