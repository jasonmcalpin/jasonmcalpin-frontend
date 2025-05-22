import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240, // Only compress files larger than 10KB
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  // Use root path for assets when using BrowserRouter
  base: '/',
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
    // Configure code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and related packages into a separate chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Split Redux and related packages into a separate chunk
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // Split UI libraries into a separate chunk
          'vendor-ui': ['framer-motion', 'react-intersection-observer'],
          // Split markdown related packages into a separate chunk
          'vendor-markdown': ['react-markdown', 'remark-gfm', 'react-syntax-highlighter'],
        },
        // Limit chunk size
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
    // Enable source maps for production
    sourcemap: false,
  },
})
