import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@livestock': '/src/LivestockApp',
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'mui';
            if (id.includes('@radix-ui')) return 'radix-ui';
            if (id.includes('react-router')) return 'router';
            if (id.includes('@emotion')) return 'emotion';
            return 'vendor';
          }
          // Split components into lazy-loaded chunks
          if (id.includes('LivestockApp')) return 'livestock';
          if (id.includes('components')) return 'components';
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
})
