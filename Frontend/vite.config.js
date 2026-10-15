import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Sửa lại dòng này từ 'react-refresh' thành 'plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Sửa lỗi "global is not defined" cho SockJS
    global: 'window',
  },
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ ngoài Docker
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
        proxyTimeout: 30000,
        timeout: 30000,
      },
    },
    watch: {
      usePolling: true, // Giúp nhận diện thay đổi code ngay lập tức
    },
  },
})
