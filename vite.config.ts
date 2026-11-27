import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: (url) => {
        if (/\.(png|jpe?g)$/i.test(url.pathname)) {
          const isBg = /BG\.png$/i.test(url.pathname);
          return new URLSearchParams({
            format: 'webp',
            quality: '82',
            w: isBg ? '1600' : '1280',
            withoutEnlargement: 'true',
          });
        }
        return new URLSearchParams();
      },
    }),
  ],
  server: {
    port: 5176 // Use a dedicated port to avoid collisions
  }
})
