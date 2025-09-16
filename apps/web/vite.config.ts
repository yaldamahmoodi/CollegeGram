import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    preview: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: true,
        allowedHosts: ['web', '188.121.102.156', 'https://devsyncc.ir', 'devsyncc.ir', 'https://devsyncc.ir/'],
    },
    server: {
        host: '0.0.0.0', // listen on all interfaces
        port: 3000,
        allowedHosts: ['web', '188.121.102.156', 'https://devsyncc.ir', 'devsyncc.ir', 'https://devsyncc.ir/'],
        hmr: {
            host: '188.121.102.156',
            protocol: 'wss', // if using HTTPS in Nginx
        },
        fs: {
            strict: false, // allow monorepo access
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@components": path.resolve(__dirname, "src/components"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@api": path.resolve(__dirname, "src/api"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@app-types": path.resolve(__dirname, "src/types"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
        },
    },
});
