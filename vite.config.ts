import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'mcp-server-dingtalk',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['fastmcp', 'zod', 'crypto', 'node:crypto'],
      output: {
        globals: {
          'fastmcp': 'FastMCP',
          'zod': 'z',
          'crypto': 'crypto'
        },
        entryFileNames: 'index.mjs',
        format: 'es'
      }
    },
    target: 'node18',
    minify: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})