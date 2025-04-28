import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        replaceAttrValues: {},
      },
      include: '**/*.svg',
    })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  base: command === 'serve' ? '/' : '/emoji-genie/'
}))