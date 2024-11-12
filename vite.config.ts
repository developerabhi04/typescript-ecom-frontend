import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'], // Separate chunk for React
          redux: ['redux', '@reduxjs/toolkit', 'react-redux'], // Separate chunk for Redux
          firebase: ['firebase/app', 'firebase/auth'], // Separate Firebase chunk
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase the chunk size warning limit to 1000 KB
  },
});
