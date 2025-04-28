import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      svgr({
        svgrOptions: {
          // Ensure fill attributes are not removed
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          // Prevent replacing attributes with currentColor
          replaceAttrValues: {},
        },
        include: "**/*.svg",
        exclude: "",
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ['react', 'react-dom']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            konva: ['konva', 'react-konva'],
            vendor: ['lucide-react', 'html2canvas', 'react-color']
          }
        }
      }
    }
  }

  // Dynamically set base path depending on whether we're in development or production
  if (command !== 'serve') {
    config.base = '/emoji-genie/'
  } else {
    config.base = '/'
  }

  return config
})