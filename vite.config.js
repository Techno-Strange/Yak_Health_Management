import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 👈 Import path

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 Add this 'resolve' block
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
})