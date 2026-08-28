import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 按需导入element-plus组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//配置@别名
import { fileURLToPath, URL } from 'node:url'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 自动导入ElMessage、ElMessageBox这类js API
      resolvers: [ElementPlusResolver()],
      // 生成自动导入的ts类型声明文件
      dts: './src/auto-imports.d.ts'
    }),
    Components({
      // 自动解析 el‑xxx 组件
      resolvers: [ElementPlusResolver()],
      dts: './src/components.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
