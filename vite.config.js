import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext", // or 'chrome89', 'firefox89', etc.

    rollupOptions: {
      input: "./es6.html", // Ensure this path is correct
    },
  },
});
