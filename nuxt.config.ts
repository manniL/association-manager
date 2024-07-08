export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@nuxthub/core'],
  hub: {
    database: true,
  },
  nitro: {
    typescript: {
      tsConfig: {
        compilerOptions: {
          types: ["vitest/importMeta"]
        },
      }
    }
  }
})
