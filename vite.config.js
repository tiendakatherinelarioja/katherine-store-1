import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // V-09 FIX: Strip all console.log and debugger calls from the production bundle.
  // This prevents leaking order data, DB schema details, and internal state
  // to end users via browser DevTools in a deployed environment.
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})