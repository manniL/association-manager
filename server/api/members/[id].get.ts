export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return await useDrizzle()
    .select()
    .from(tables.members)
    .where(eq(tables.members.id, Number(id)))
    .get()
})