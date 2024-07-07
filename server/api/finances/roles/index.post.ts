import { paymentRoles } from "~/server/database/schema.js"
import { paymentRoleServerSchema } from "~/server/utils/schema.js"

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, paymentRoleServerSchema.parse)
  
  const insertedEntry = await useDrizzle()
    .insert(paymentRoles)
    .values({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning().get()

  return insertedEntry
})