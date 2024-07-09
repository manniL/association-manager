export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const possiblePayment = await useDrizzle()
    .select()
    .from(tables.payments)
    .where(eq(tables.payments.id, Number(id)))
    .get()

  if (!possiblePayment) {
    throw createError({ statusCode: 404, message: 'Payment not found' })
  }

  const payees = await useDrizzle()
    .select()
    .from(tables.paymentPayees)
    .where(eq(tables.paymentPayees.paymentId, Number(id)))
    .all()

  return { ...possiblePayment, payees }
})
