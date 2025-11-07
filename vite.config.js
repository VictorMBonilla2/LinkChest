import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(),

  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        options: resolve(__dirname, "src/options/index.html"),
        web: resolve(__dirname, "src/web/index.html"),
        background: resolve(__dirname, "src/background.js"),
      },
      output: {
      entryFileNames: (chunk) => {
        if (chunk.name === 'background') return 'assets/background.js'; // único para SW
        return 'assets/[name].js';
      },
      chunkFileNames: (chunk) => {
        if (chunk.name === 'background') return 'assets/background.js';
        return 'assets/[name].js';
      },
      assetFileNames: "assets/[name].[ext]",
      manualChunks: (id) => {
        // Evitar split de background
        if (id.includes('background')) return 'background';
      },
    },
    },
  },

});
