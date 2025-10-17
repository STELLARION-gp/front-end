import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Use GitHub Pages base path for gh-pages deployment, root for Docker/other deployments
const base = process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' && !process.env.DOCKER_BUILD ? '/STELLARION/' : '/');

export default defineConfig({
  plugins: [react()],
  base: base,
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // This injects your global variables, mixins, etc. into every SCSS file automatically.
        additionalData: `
          @use "@/styles/abstracts/variables" as *;
          @use "@/styles/abstracts/mixins" as *;
        `,
      },
    },
  },
});
