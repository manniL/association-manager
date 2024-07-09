import { z } from "zod"
import { selectMemberSchema } from "~/server/database/schema.js"
import type { TransformedMemberWithId } from "~/types.js"
import type { PaymentType } from "~/utils/schemas.js"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Does the member exist?
  // If not throw 404
  // Else return transformed member
  const possibleMember = await useDrizzle()
    .select()
    .from(tables.members)
    .where(eq(tables.members.id, Number(id)))
    .get()

  if (!possibleMember) {
    throw createError({ statusCode: 404, message: 'Member not found' })
  }

  return transformMember(possibleMember)
})

type DrizzleMember = z.output<typeof selectMemberSchema>

// TODO: Save that ReturnType as own type later on
function transformMember(member: DrizzleMember): TransformedMemberWithId {
  const {
    id, firstName, lastName, company, gender, birthDate, phone, email, street, city, zip, state, country,
    membershipId, joinDate, leaveDate, notes, paymentRole, paymentSchedule, paymentType, sepaAccountHolder,
    sepaIban,
    sepaBic,
    sepaMandateDate,
    sepaMandateId
  } = member

  const payment: Readonly<PaymentType> = paymentType === 'sepa'
    ? {
      type: 'SEPA', data: {
        accountHolder: sepaAccountHolder ?? undefined,
        iban: sepaIban as string, 
        bic: sepaBic as string,
        mandateDate: sepaMandateDate as Date,
        mandateId: sepaMandateId as string,
      }
    } as const
    : { type: 'CASH', data: {} } as const

  return {
    id,
    firstName,
    lastName,
    company: company ?? undefined,
    gender,
    birthDate: birthDate ?? undefined,
    phone: phone ?? undefined,
    email: email ?? undefined,
    address: {
      street, city, zip,
      state: state ?? undefined,
      country: country ?? undefined,
    },
    membershipId,
    joinDate: joinDate ?? undefined,
    leaveDate: leaveDate ?? undefined,
    notes: notes ?? undefined,
    paymentRole: String(paymentRole), // TODO: Can we keep that as number?
    paymentSchedule,
    payment
  }
}