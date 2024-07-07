import { members } from "~/server/database/schema.js"
import { memberFormSchema } from "~/server/utils/schema.js"

export default defineEventHandler(async (event) => {
  // Parse it through the Member form's schema
  const body = await readValidatedBody(event, memberFormSchema.parse)

  const { firstName, lastName, company, gender, birthDate, phone, email,
    address: { street, city, zip, state, country },
    membershipId, joinDate, leaveDate, notes, paymentRole, paymentSchedule,
    payment: {
      type: paymentType,
      data: paymentData
    }
  } = body

  await checkForPaymentRole(paymentRole)

  const sepaAccountHolder = 'accountHolder' in paymentData ? paymentData.accountHolder : undefined
  const sepaIban = 'iban' in paymentData ? paymentData.iban : undefined
  const sepaBic = 'bic' in paymentData ? paymentData.bic : undefined

  const insertedEntry = await useDrizzle()
    .insert(members)
    .values({
      firstName, // TODO: Check why TS is complaining
      lastName,
      company,
      gender,
      birthDate,
      phone,
      email,
      street,
      city,
      zip,
      state,
      country,
      membershipId,
      joinDate,
      leaveDate,
      notes,
      paymentRole,
      paymentSchedule,
      paymentType,
      sepaAccountHolder,
      sepaIban,
      sepaBic,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning().get()

  // Then, use the db representation to insert the new Member, before validate through Zod
  return insertedEntry
})

