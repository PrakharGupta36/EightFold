import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // clean & works with TS paths
    },
  },
  server: {
    open: true, // optional: auto-open in browser
    port: 5173, // default Vite port (change if needed)
  },
  build: {
    outDir: "dist",
    sourcemap: true, // easier debugging in production
  },
});
