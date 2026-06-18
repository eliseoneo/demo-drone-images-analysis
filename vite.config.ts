import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('html2canvas')) {
                return 'html2canvas'
              }
              if (id.includes('jspdf') || id.includes('jspdf-autotable')) {
                return 'pdf'
              }
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'charts'
              }
              if (
                id.includes('react-dom') ||
                id.includes('react-router') ||
                id.includes('/react/')
              ) {
                return 'react-vendor'
              }
            }
          },
        },
      },
    },
  }
})
