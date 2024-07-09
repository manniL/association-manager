import { members } from "~/server/database/schema.js"
import { memberFormSchema } from "~/server/utils/schema.js"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

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
  const sepaMandateId = 'mandateId' in paymentData ? paymentData.mandateId : undefined
  const sepaMandateDate = 'mandateDate' in paymentData ? paymentData.mandateDate : undefined

  const updatedEntry = await useDrizzle()
    .update(members)
    .set({
      firstName,
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
      paymentRole: Number(paymentRole),
      paymentSchedule,
      paymentType: paymentType === 'SEPA' ? 'sepa' : 'cash',
      sepaAccountHolder,
      sepaIban,
      sepaBic,
      sepaMandateDate,
      sepaMandateId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(members.id, Number(id)))
    .returning().get()

  if(!updatedEntry) {
    throw createError({ statusCode: 422, message: 'No Member found for that operation' })
  }
  
  return updatedEntry
})