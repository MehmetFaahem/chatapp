import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  proxy: {
    "/socket.io": {
      target: "https://kothonapi.vercel.app",
      ws: true,
      changeOrigin: true,
    },
    "/users": {
      target: "https://kothonapi.vercel.app",
      changeOrigin: true,
    },
  },
});
