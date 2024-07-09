import { z } from 'zod'
export { insertMemberSchema, selectMemberSchema } from '~/server/database/schema'
import { genderValues, paymentScheduleIds } from './constants.js'

export type PaymentType = z.infer<typeof memberFormSchema>['payment']

export const memberFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(genderValues),
  membershipId: z.string().min(1),
  company: z.string().optional(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    zip: z.string().min(1),
    state: z.string().optional(),
    country: z.string().optional(), // TODO: List
  }),
  joinDate: z.coerce.date().optional(), // TODO: pipe to avoid null/invalid
  leaveDate: z.coerce.date().optional(),
  birthDate: z.coerce.date().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  paymentRole: z.string(), // TODO: Make more strict?
  paymentSchedule: z.enum(paymentScheduleIds),
  payment: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('SEPA'),
      data: z.object({
        accountHolder: z.string().optional(),
        iban: z.string(), // Use ibantools
        bic: z.string(), // To validate / infer "somehow"
        mandateId: z.string(),
        mandateDate: z.coerce.date(),
      })
    }),
    z.object({
      type: z.literal('CASH'),
      data: z.object({})
    })]
  )
})

export const paymentRoleFormSchema = z.object({
  name: z.string().min(1),
  amount: z.string().transform(s => Number(s.replaceAll(',', '')) * 100),
  notes: z.string().optional()
})

export const paymentFormSchema = z.object({
  startDate: z.coerce.date().optional(), // TODO: pipe to avoid null/invalid
  collectionDate: z.coerce.date(), // TODO: pipe to avoid null/invalid
})