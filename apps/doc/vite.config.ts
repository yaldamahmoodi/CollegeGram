
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { tanstackRouter } from '@tanstack/router-vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    tanstackRouter(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3002,
    strictPort: true,
    allowedHosts: [
      "web",
      "188.121.102.156",
      "https://devsyncc.ir",
      "devsyncc.ir",
      "https://devsyncc.ir/",
      "devsync.rahnemacollege.ir",
      "https://devsync.rahnemacollege.ir",
    ],
  },
  server: {
    host: "0.0.0.0", // listen on all interfaces
    port: 3002,
    allowedHosts: [
      "web",
      "188.121.102.156",
      "https://devsyncc.ir",
      "devsyncc.ir",
      "https://devsyncc.ir/",
      "devsync.rahnemacollege.ir",
      "https://devsync.rahnemacollege.ir",
    ],
    hmr: {
      host: "188.121.102.156",
      protocol: "wss", // if using HTTPS in Nginx
    },
    fs: {
      strict: false, // allow monorepo access
    },
  },
})
