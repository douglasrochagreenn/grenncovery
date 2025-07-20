import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    server: {
      host: "0.0.0.0", // Permite que o servidor seja acessado externamente
      port: mode === "production" ? 3000 : 5173, // Define a porta do s ervidor de desenvolvimento
      https: mode === "production" ? true : false, // Habilita o HTTPS no servidor de desenvolvimento
      proxy: {
        "/socket": {
          target: "ws://localhost:3000", // Redireciona as requisições para o WebSocket
          ws: true, // WebSocket habilitado no proxy
        },
      },
    },
    // Configurações específicas para o HMR
    hmr: {
      host: "0.0.0.0", // Permite que o HMR seja acessado externamente
      protocol: "wss", // Usando WebSocket no desenvolvimento
      clientPort: mode === "production" ? 443 : 3000, // Porta para produção ou desenvolvimento
    },
  };
});
