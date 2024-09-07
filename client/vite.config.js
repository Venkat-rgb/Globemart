import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import compression from "vite-plugin-compression2";

// https://vitejs.dev/config/
// Adding both gzip and brotli compression
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
    }),
    compression({
      algorithm: "brotliCompress",
    }),
  ],
});
