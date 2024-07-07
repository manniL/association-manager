import { paymentRoles } from "~/server/database/schema.js"
import { paymentRoleServerSchema } from "~/server/utils/schema.js"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const body = await readValidatedBody(event, paymentRoleServerSchema.parse)

  const updatedEntry = await useDrizzle()
    .update(paymentRoles)
    .set({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(paymentRoles.id, Number(id)))
    .returning().get()

  if(!updatedEntry) {
    throw createError({ statusCode: 422, message: 'No Payment Role found for that operation' })
  }
  
  return updatedEntry
})