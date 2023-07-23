import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      '/local': {
        target: 'http://0.0.0.0:9000',	//实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local/, '')
      },
      '/serverless': {
        target: 'https://chat-chat-eerndkjruc.cn-hangzhou.fcapp.run',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/serverless/, '')
      },
      '/railwayApp': {
        target: 'https://chess-back-production-ad86.up.railway.app/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/railwayApp/, '')
      },
      '/zeabur': {
        target: 'https://chess-back.zeabur.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zeabur/, '')
      },
    }
  }
});
