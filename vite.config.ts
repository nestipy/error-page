import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prism from "vite-plugin-prismjs"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      prism({
        languages: "all",
        css: true,
      })
  ],
    base: "/_devtools/static"
})
