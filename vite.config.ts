import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'mcp-server-dingtalk',
      fileName: 'index',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['fastmcp', 'zod', 'crypto', 'node:crypto'],
      output: {
        globals: {
          'fastmcp': 'FastMCP',
          'zod': 'z',
          'crypto': 'crypto'
        },
        entryFileNames: 'index.js',
        format: 'cjs',
        banner: '#!/usr/bin/env node'
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