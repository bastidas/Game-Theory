import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "./index.html",
        sandbox: "./sandbox.html",
        deeper: "./deeper.html",
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
