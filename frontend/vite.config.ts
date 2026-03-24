import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 开发时代理 API 请求到后端
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
