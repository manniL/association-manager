export const genderOptions = [
  {
    label: 'Prefer not to say',
    value: 'no-answer'
  },
  {
    label: 'Male',
    value: 'male'
  },
  {
    label: 'Female',
    value: 'female'
  },
  {
    label: 'Other',
    value: 'other'
  }
] as const

export const genderValues = ['male', 'female', 'other', 'no-answer'] as const satisfies Exclude<typeof genderOptions[number]['value'], undefined>[] 

export const paymentScheduleOptions = [
  {
    id: 'monthly',
    name: 'Monthly',
    monthInterval: 1,
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    monthInterval: 3,
  },
  {
    id: 'half-yearly',
    name: 'Bi-Annually',
    monthInterval: 6,
  },
  {
    id: 'yearly',
    name: 'Annually',
    monthInterval: 12,
  },
] as const

export type PaymentScheduleIds = typeof paymentScheduleOptions[number]['id']

export const paymentScheduleIds = [
  'monthly', 'quarterly', 'half-yearly', 'yearly'
] as const
