import { z } from 'zod'

export { memberFormSchema } from '~/utils/schemas.js'

export const paymentRoleServerSchema = z.object({
  name: z.string().min(1),
  amount: z.number(),
  notes: z.string().optional()
})