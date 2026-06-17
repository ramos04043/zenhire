import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/local-api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/local-api/, '/api'),
      },
      '/api-proxy': {
        target: 'https://zendbx-2-zpp9.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6ZW5kYngiLCJwcm9qZWN0X2lkIjoiNzE4YWY1ZWYtOGZmYi00OWJhLWI1NGEtMjZjYzM3NzU1ZDJjIiwicHJvamVjdF9zbHVnIjoiemVuaGlyZS03MThhZjVlZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwOTgyOTQ1fQ.9-wA2JKEKcWLQt0T8h8NdOZWNRHMppHe438pj5fMfgk'
            const projectId = '718af5ef-8ffb-49ba-b54a-26cc37755d2c'
            proxyReq.setHeader('Origin', 'http://localhost:5173')
            proxyReq.setHeader('apikey', anonKey)
            proxyReq.setHeader('x-project-id', projectId)
          })
        },
      },
    },
  },
})
