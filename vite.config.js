import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // rutas relativas en producción
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        proyecto: 'proyecto.html',
      },
    },
  },
});
