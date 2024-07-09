export default defineEventHandler(async () => {
  const payments = await useDrizzle().select()
  .from(tables.payments)
  .all()
  
  return payments.length === 0
})