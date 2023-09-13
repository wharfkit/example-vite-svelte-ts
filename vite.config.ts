import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { visualizer } from "rollup-plugin-visualizer";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        nodePolyfills({
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true,
        }),
        visualizer({
            template: "treemap", // or sunburst
            open: true,
            gzipSize: true,
            brotliSize: true,
            filename: "analyse.html", // will be saved in project's root
        }),
    ],
    optimizeDeps: {
        esbuildOptions: {
          // Node.js global to browser globalThis
          define: {
            global: "globalThis",
          },
        },
    },
})
