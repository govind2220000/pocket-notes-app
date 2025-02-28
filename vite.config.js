import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    base: '/pocket-notes-app/',
  plugins: [react()],
  server: {
    allowedHosts: [".ngrok-free.app"],
  },
});
