import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: 'ai-web',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [react()],
  server: {
    host: true, // host: "0.0.0.0"
    hmr: {
      overlay: false
    },
    /** 是否自动打开浏览器 */
    open: false,
    /** 跨域设置允许 */
    cors: true,
    /** 端口被占用时，是否直接退出 */
    strictPort: false,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        // target: 'http://172.18.88.61:8000',
        // target: 'http://172.18.88.141:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ai-api/, '')
      }
    }
  }
})
