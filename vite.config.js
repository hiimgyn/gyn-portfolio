import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb'],
  plugins: [
    vue(),
    tailwindcss(),
    viteCompression({
      algorithm: 'brotliCompress', // Use Brotli for best compression
      ext: '.br',
      threshold: 1024, // Only compress files >1KB
      deleteOriginFile: false, // Keep original files
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
          animations: ['gsap']
        }
      }
    }
  }
})
