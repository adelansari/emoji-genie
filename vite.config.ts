import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  base: '/emoji-genie/',
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
})
