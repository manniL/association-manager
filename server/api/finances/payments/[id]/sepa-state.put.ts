import { inArray } from "drizzle-orm"

/**
 * Changes the payment state for a payee of a certain payment, e.g. from unpaid to paid
 * Used in the payment overview
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const possiblePayment = await useDrizzle()
    .select()
    .from(tables.payments)
    .where(eq(tables.payments.id, Number(id)))
    .get()

  if (!possiblePayment) {
    throw createError({ statusCode: 400, message: 'Payment not found' })
  }

  const allPayees = await useDrizzle()
    .select()
    .from(tables.paymentPayees)
    .where(eq(tables.paymentPayees.paymentId, Number(id)))
    .all()

  if (!allPayees.length) {
    throw createError({ statusCode: 500, message: 'Payment must have Payees' })
  }

  const members = await $fetch('/api/members')
  const payeesWithSepaIds = allPayees.filter(payee => {
    const member = members.find(m => m.id === payee.memberId)
    return member?.paymentType === 'sepa'
  }).map(p => p.id)

  if (!payeesWithSepaIds.length) {
    return { message: 'No SEPA Payers' }
  }

  await useDrizzle()
    .update(tables.paymentPayees)
    .set({ hasPaid: true })
    .where(inArray(tables.paymentPayees.id, payeesWithSepaIds))
    .run()

  return { message: 'Payment state updated for X members' }
})