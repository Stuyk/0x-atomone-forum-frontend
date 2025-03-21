import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  base: '/0x-atomone-forum-frontend/',
  plugins: [vue(), tailwindcss(), nodePolyfills()],
})
