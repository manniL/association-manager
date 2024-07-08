// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // environment: 'nuxt',
    includeSource: ['server/**/*.{js,ts}'], 
  },
})
