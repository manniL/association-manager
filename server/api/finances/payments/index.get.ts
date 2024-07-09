export default defineEventHandler(async (event) => {
  return await useDrizzle()
    .select()
    .from(tables.payments)
    .all()
})
