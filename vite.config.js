import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import env from "vite-plugin-env-compatible";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), env({ prefix: "VITE", mountedPath: "process.env"})],
})
