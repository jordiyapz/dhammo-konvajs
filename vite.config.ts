import { defineConfig } from "vite";
import { resolve } from "path";

const root = resolve(__dirname, "src");

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(root),
    },
  },
});
