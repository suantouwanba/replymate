import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // 加载 .env 文件中的环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // /api/coze/xxx → https://api.coze.cn/xxx
        // Vite 在中间加上 Token，浏览器看不到
        '/api/coze': {
          target: 'https://api.coze.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/coze/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // 🔒 Token 只在这里（Node.js 服务端）拼接，不会发到浏览器
              proxyReq.setHeader('Authorization', `Bearer ${env.COZE_TOKEN}`)
            })
          },
        },
      },
    },
  }
})
