// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    restoreMocks: true,
    setupFiles: ['./src/App.Core/infrastructure/testing/test-setup.ts'],
    exclude: ['./src/Atlas.E2E', '**/node_modules/**', '**/dist/**', '**/*.spec.ts'],
    onConsoleLog(log) {
      if (log.includes('Lit is in dev mode')) return false

      return true
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          // According to SASS: @use statements must be written before any
          // other sass rules, so make sure it's appearing first.
          @use '@/App.UI/assets/styles/partials' as *;
          @use '@/App.UI/assets/styles/breakpoints' as *;
          @use "include-media" as * with (
            $breakpoints: $breakpoints
          );
        `
      }
    }
  }
})
