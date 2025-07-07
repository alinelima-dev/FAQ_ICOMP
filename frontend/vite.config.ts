import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@ioc": path.resolve(__dirname, "src/ioc"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@components": path.resolve(__dirname, "src/components"),
      "@services": path.resolve(__dirname, "src/services"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@locales": path.resolve(__dirname, "src/locales"),
    },
  },
});
