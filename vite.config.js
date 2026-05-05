import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Usa base relativo './' que funciona tanto en local como en GitHub Pages
// independientemente del nombre del repositorio
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
