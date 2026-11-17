import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT || 3000),
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_URL || 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
});
