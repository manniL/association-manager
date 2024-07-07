import { count } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const memberCount = await useDrizzle()
    .select({ value: count() })
    .from(tables.members)
    .get()

  return { count: memberCount?.value }
})