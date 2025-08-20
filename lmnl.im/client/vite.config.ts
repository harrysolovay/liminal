import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  envDir: "../..",
  server: {
    proxy: {
      "/v1": {
        target: "http://localhost:3000",
        changeOrigin: false,
        secure: false,
      },
    },
  },
})
