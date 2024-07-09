export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@nuxthub/core', "@nuxtjs/i18n"],
  hub: {
    database: true,
  },
  runtimeConfig: {
    auth: {
      sessionSecret: 'secret',
      username: 'test',
      password: 'test'
    }
  },
  nitro: {
    replace: {
      'globalThis._importMeta_.vitest': 'undefined',
    },
    typescript: {
      tsConfig: {
        compilerOptions: {
          types: ["vitest/importMeta"]
        },
      }
    }
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        file: 'en-US.ts'
      },
      {
        code: 'de',
        file: 'de-DE.ts'
      },
    ],
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en'
  }
})