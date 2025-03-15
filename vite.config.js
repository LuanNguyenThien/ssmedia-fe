import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        port: 3000,
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
