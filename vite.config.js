import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react(), tsconfigPaths(),
        nodePolyfills({
            global: true, // Polyfill global
            protocolImports: true, // Hỗ trợ các module như util, stream
        }),
    ],
    define: {
        global: 'window', // Thay global bằng window trong toàn bộ code
    },
    server: {
        watch: {
            usePolling: true,
        },
        host: '0.0.0.0', // Cho phép truy cập từ mạng ngoài (như điện thoại)
        port: 3000,      // Port server local của bạn
        allowedHosts: [
        'localhost',
        '192.168.1.8',            
        `9672-1-52-116-30.ngrok-free.app`,                  // IP local của bạn
        '0416-2001-ee0-5201-5e20-59b9-553a-6a8d-4ab8.ngrok-free.app',
        '40ba-2001-ee0-5201-5e20-cc4c-d8d4-2703-1165.ngrok-free.app', // Host ngrok hiện tại
        '*.ngrok-free.app'                          // Cho phép tất cả subdomains của ngrok
        ],
        // proxy: {
        //   '/api': {
        //     target: 'http://localhost:5000',
        //     changeOrigin: true,
        //     secure: false
        //   },
        //   '/socket.io': {
        //     target: 'http://localhost:5000',
        //     ws: true,           // Hỗ trợ WebSocket cho Socket.IO
        //     changeOrigin: true,
        //     secure: false
        //   }
        // }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@components": path.resolve(__dirname, "src/components"),
            "@services": path.resolve(__dirname, "src/services"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@mocks": path.resolve(__dirname, "src/mocks"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@colors": path.resolve(__dirname, "src/colors"),
            "@redux": path.resolve(__dirname, "src/redux-toolkit"),
            "@config": path.resolve(__dirname, "src/config"),
            "@root": path.resolve(__dirname, "src"),
        },
    },
});
