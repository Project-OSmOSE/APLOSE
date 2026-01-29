import { ConfigEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path'

// https://vitejs.dev/config/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: ConfigEnv): UserConfig => {

  return {
    base: '/app/',
    server: {
      proxy: {
        '/api': 'http://localhost:8000',
        '/backend': 'http://localhost:8000',
        '/doc': 'http://localhost:5174',
      },
      cors: false,
    },
    plugins: [ react() ],
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, './src') },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern"
        },
      },
    },
  }
};
