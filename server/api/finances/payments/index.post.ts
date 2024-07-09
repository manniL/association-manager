import type { InternalApi } from 'nitropack'
import { paymentScheduleOptions, type PaymentScheduleIds } from '~/utils/constants.js'
import type { SimplifiedMember } from '~/server/utils/payment.js'
import { paymentPayees, payments } from '~/server/database/schema.js'
import { paymentFormSchema } from '~/utils/schemas.js'
import { desc } from 'drizzle-orm'

type Member = InternalApi['/api/members']['get'][number]
type PaymentRole = InternalApi['/api/finances/roles']['get'][number]

export default defineEventHandler(async (event) => {
  const { startDate: possibleStartDate, collectionDate } = await readValidatedBody(event, paymentFormSchema.parse)
  const startDate = possibleStartDate ?? await getStartDateFromLastPayment()

  // Fetch all members
  const [members, paymentRoles] = await Promise.all([
    $fetch('/api/members'),
    $fetch('/api/finances/roles')]
  )

  // Transform as as needed
  const simplifiedMembers = simplifyMembers(members, paymentRoles)

  // Get members who need to pay
  const { payees, paymentDate } = getAllPayeeInformation(simplifiedMembers, startDate)

  // Calculate payment amount (non-monthly)

  const payeesWithPaymentAmount: SimplifiedMemberWithPayment[] = payees.map(payee => {
    const paymentSchedule = paymentScheduleOptions.find(schedule => schedule.id === payee.paymentSchedule)
    if (!paymentSchedule) {
      throw new Error(`Payment schedule ${payee.paymentSchedule} not found`)
    }
    const paymentAmount = payee.paymentRole.amount * paymentSchedule.monthInterval
    return {
      ...payee,
      paymentAmount
    }
  })

  return persistPayment(payeesWithPaymentAmount, paymentDate, collectionDate)

})

function simplifyMembers(members: Member[], paymentRoles: PaymentRole[]): SimplifiedMember[] {
  return members.map(member => {
    const role = paymentRoles.find(role => role.id === member.paymentRole)
    if (!role) {
      throw new Error(`Payment role ${member.paymentRole} for member ${member.id} not found`)
    }
    const { notes: _, ...paymentRole } = role

    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      joinDate: member.joinDate ? new Date(member.joinDate) : undefined,
      leaveDate: member.leaveDate ? new Date(member.leaveDate) : undefined,
      paymentSchedule: member.paymentSchedule as PaymentScheduleIds,
      paymentRole,
    }
  })
}

type SimplifiedMemberWithPayment = SimplifiedMember & {
  paymentAmount: number
}


/**
 * @param payees - The members who need to pay
 * @param paymentDate - The "start of the month" the payment belongs to
 * @param collectionDate - The date the payment is collected, defaults to paymentDate
 */
async function persistPayment(payees: SimplifiedMemberWithPayment[], paymentDate: Date, collectionDate = paymentDate) {
  // TODO: Transactional insert
  const payment = await createPayment(paymentDate, collectionDate)
  const paymentId = payment.id

  const handledPayees = []

  for (const payee of payees) {
    handledPayees.push(await insertPayment(paymentId, payee))
  }

  return {
    ...payment,
    payees: handledPayees
  }
}

async function createPayment(paymentDate: Date, collectionDate: Date) {
  console.log({collectionDate})
  const now = new Date()
  return await useDrizzle()
    .insert(payments)
    .values({
      paymentDate,
      collectionDate,
      createdAt: now,
      updatedAt: now
    }).returning().get()
}

async function insertPayment(paymentId: number, payee: SimplifiedMemberWithPayment) {
  return await useDrizzle()
    .insert(paymentPayees)
    .values({
      paymentId,
      memberId: payee.id,
      firstName: payee.firstName,
      lastName: payee.lastName,
      joinDate: payee.joinDate,
      leaveDate: payee.leaveDate,
      paymentSchedule: payee.paymentSchedule,
      paymentAmount: payee.paymentAmount,
      paymentRoleId: payee.paymentRole.id,
      paymentRoleAmount: payee.paymentRole.amount,
      paymentRoleName: payee.paymentRole.name,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning().get()
}

async function getStartDateFromLastPayment(): Promise<Date> {
  const lastPayment = await useDrizzle()
    .select({ paymentDate: payments.paymentDate })
    .from(payments)
    .orderBy(desc(payments.paymentDate)).limit(1)
    .get()
  if (!lastPayment) {
    throw new Error('No previous payment date provided')
  }
  return lastPayment.paymentDate
}
