import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/cadence-composer/',
  plugins: [react()],
  test: {
    // Playwright e2e specs live in tests/e2e and run via `pnpm test:e2e`;
    // keep vitest scoped to unit tests in src/__tests__.
    include: ['src/__tests__/**/*.test.js'],
  },
})
