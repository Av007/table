import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    define: {
      // eslint-disable-next-line no-undef
      'process.env': {...process.env, ...loadEnv(mode, process.cwd())}
    },
  }
});
