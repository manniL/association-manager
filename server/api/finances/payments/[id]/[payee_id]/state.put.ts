/**
 * Changes the payment state for a payee of a certain payment, e.g. from unpaid to paid
 * Used in the payment overview
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const payeeId = getRouterParam(event, 'payee_id')

  const possiblePayment = await useDrizzle()
    .select()
    .from(tables.payments)
    .where(eq(tables.payments.id, Number(id)))
    .get()

  if (!possiblePayment) {
    throw createError({ statusCode: 400, message: 'Payment not found' })
  }

  const payeeForPaymentCondition = and(
    eq(tables.paymentPayees.paymentId, Number(id)),
    eq(tables.paymentPayees.memberId, Number(payeeId))
  )

  const possiblePayee = await useDrizzle()
    .select()
    .from(tables.paymentPayees)
    .where(payeeForPaymentCondition)
    .get()

  if (!possiblePayee) {
    throw createError({ statusCode: 400, message: 'Payee not found' })
  }

  await useDrizzle()
    .update(tables.paymentPayees)
    .set({ hasPaid: !possiblePayee.hasPaid })
    .where(payeeForPaymentCondition)
    .run()

  return { message: 'Payment state updated' }
})