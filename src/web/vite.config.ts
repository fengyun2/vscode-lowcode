import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@': resolve(),
    },
  },
  server: {
    // port: 3000,
    // proxy: {
    //   'oauth/': {
    //     target: 'https://aip.baidubce.com/oauth',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/oauth/, ''),
    //   },
    //   'rpc/': {
    //     target: 'https://aip.baidubce.com/rpc',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/rpc/, ''),
    //   },
    // },
  }
});
