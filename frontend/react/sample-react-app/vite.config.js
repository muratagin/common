import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@app": fileURLToPath(new URL("./src/app/", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets/", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components/", import.meta.url)
      ),
      "@contexts": fileURLToPath(new URL("./src/contexts/", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/css/", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks/", import.meta.url)),
      "@libs": fileURLToPath(new URL("./src/libs/", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages/", import.meta.url)),
      "@routes": fileURLToPath(new URL("./src/routes/", import.meta.url)),
      "@slices": fileURLToPath(new URL("./src/slices/", import.meta.url)),
      "@validations": fileURLToPath(
        new URL("./src/validations/", import.meta.url)
      ),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
