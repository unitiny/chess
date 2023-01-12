import {defineConfig} from 'vite';
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
        }
    }
});
