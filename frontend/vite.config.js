import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  proxy: {
    "/socket.io": {
      target: "http://localhost:3000",
      ws: true,
      changeOrigin: true,
    },
    "/users": {
      target: "http://localhost:3000",
      changeOrigin: true,
    },
  },
});
