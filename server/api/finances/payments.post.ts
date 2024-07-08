import type { InternalApi } from 'nitropack'
import { z } from 'zod'
import { paymentScheduleOptions, type PaymentScheduleIds } from '~/utils/constants.js'

const paymentServerSchema = z.object({
  previousPaymentDate: z.coerce.date().optional(), // TODO: pipe to avoid null/invalid
})

type Member = InternalApi['/api/members']['get'][number]
type PaymentRole = InternalApi['/api/finances/roles']['get'][number]

export default defineEventHandler(async (event) => {
  const { previousPaymentDate: previousPaymentDateOrStartDate } = await readValidatedBody(event, paymentServerSchema.parse)
  if (!previousPaymentDateOrStartDate) {
    throw new Error('No previous payment date provided')
  }

  // Fetch all members
  const [members, paymentRoles] = await Promise.all([
    $fetch('/api/members'),
    $fetch('/api/finances/roles')]
  )

  // Transform as as needed
  const simplifiedMembers = simplifyMembers(members, paymentRoles)

  // Get members who need to pay
  const { payees, paymentDate } = getAllPayeeInformation(simplifiedMembers, previousPaymentDateOrStartDate)

  // Calculate payment amount (non-monthly)

  const payeesWithPaymentAmount = payees.map(payee => {
    const paymentSchedule = paymentScheduleOptions.find(schedule => schedule.id === payee.paymentSchedule)
    if (!paymentSchedule) {
      throw new Error(`Payment schedule ${payee.paymentSchedule} not found`)
    }
    const paymentAmount = payee.paymentRoleAmount * paymentSchedule.monthInterval
    return {
      ...payee,
      paymentAmount
    }
  })

  // TODO: UTC date handlign (see payment.ts)

  // TODO: Persist the payment in the database

  return { payeesWithPaymentAmount, paymentDate }

})



function simplifyMembers(members: Member[], paymentRoles: PaymentRole[]) {
  return members.map(member => ({
    id: member.id,
    joinDate: member.joinDate ? new Date(member.joinDate) : undefined,
    leaveDate: member.leaveDate ? new Date(member.leaveDate) : undefined,
    paymentSchedule: member.paymentSchedule as PaymentScheduleIds,
    paymentRoleAmount: paymentRoles.find(role => role.id === member.paymentRole)?.amount ?? 0,
  }))
}