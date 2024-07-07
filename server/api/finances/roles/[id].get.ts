import { z } from "zod"
import { selectPaymentRoleSchema } from "~/server/database/schema.js"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const possibleRole = await useDrizzle()
    .select()
    .from(tables.paymentRoles)
    .where(eq(tables.paymentRoles.id, Number(id)))
    .get()

  if (!possibleRole) {
    throw createError({ statusCode: 404, message: 'Payment role not found' })
  }

  return transformRole(possibleRole)
})

type DrizzleRole = z.output<typeof selectPaymentRoleSchema>
function transformRole(possibleRole: DrizzleRole) {
  return {
    name: possibleRole.name,
    amount: possibleRole.amount, // TODO: Should we divide here already?
    notes: possibleRole.notes ?? undefined // null ?? undefined => undefined
  }
}
