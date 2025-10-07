// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // เปลี่ยนได้ตามต้องการ
    host: true,        // ถ้าจะเข้าจากเครื่องอื่นในแลน
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // ถ้ามีเส้นทางอื่น เช่น /uploads ก็เพิ่มได้
      // '/uploads': { target: 'http://localhost:3000', changeOrigin: true, secure: false }
    },
  },
});
