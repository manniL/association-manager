

const LOCALE_EN = {
  welcome: 'Welcome',
  'test': 'abc'
} as const

type PartialDeepKeyOf<T> = {
  [P in keyof T]: T[P] extends string
  ? string
  : PartialDeepKeyOf<T[P]>
};

export type LOCALE = PartialDeepKeyOf<typeof LOCALE_EN>

export default defineI18nLocale<LOCALE>(async locale => LOCALE_EN)