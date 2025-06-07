import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  assetsInclude: ['**/*.glb'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
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
      // Đặt @ trỏ vào thư mục src. Giờ import '@/assets/flags/us.svg' sẽ chạy được
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
