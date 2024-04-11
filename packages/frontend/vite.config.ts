import { defineConfig, loadEnv } from "vite";
// @ts-ignore
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // console.log(env);

  return {
    // base: env.VITE_APP_URL,
    resolve: {
      alias: {
        // process: "process/browser",
        util: "util",
        "@": path.resolve(__dirname, "src"),
        "@contracts": path.resolve(__dirname, "contracts")
      }
    },
    optimizeDeps: {
      include: ["@coredin/shared/*"]
    },
    build: {
      commonjsOptions: {
        include: [/shared/, /node_modules/]
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    },
    plugins: [react()]
  };
});
