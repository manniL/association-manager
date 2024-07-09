import type { LOCALE } from "~/lang/en-US.js"
type GenderOptions = keyof LOCALE['basic']['genderOptions']
export const genderValues = ['male', 'female', 'other', 'no-answer'] as const satisfies GenderOptions[]

export type PaymentScheduleIds = keyof LOCALE['payment']['schedule']['options']
export const paymentScheduleOptions: Record<PaymentScheduleIds, number> = {
  'monthly': 1,
  'quarterly': 3,
  'half-yearly': 6,
  'yearly': 12,
} as const

export const paymentScheduleIds = [
  'monthly', 'quarterly', 'half-yearly', 'yearly'
] as const satisfies PaymentScheduleIds[] // TODO: Tighter type checking
