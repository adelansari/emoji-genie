import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group React framework code together
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }
          
          // Group Konva related packages
          if (id.includes('node_modules/konva') || 
              id.includes('node_modules/react-konva')) {
            return 'konva-vendor';
          }
          
          // Group other third-party libraries
          if (id.includes('node_modules')) {
            return 'vendors';
          }
        }
      }
    }
  },
})
