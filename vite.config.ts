// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(async () => {
  // хватаем плагин ESM-only через динамический import
  const tailwindcss = (await import('@tailwindcss/vite')).default

  return {
    plugins: [
      react(),
      tailwindcss(),   // теперь загрузится корректно
    ],
    server: {
      proxy: {
        '/email': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
