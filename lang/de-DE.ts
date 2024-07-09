import type { LOCALE } from "./en-US.js"

export default defineI18nLocale<LOCALE>(async locale => {
  return {
    welcome: 'Willkommen',
    test: ''
  }
})