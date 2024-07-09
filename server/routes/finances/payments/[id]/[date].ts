import type { InternalApi } from 'nitropack' 
import { createXmlForSepaPayment, type SepaMemberEntry } from "~/utils/sepa.js"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  /** Workaround because router does not support partials */
  const rawDateWithXmlEnding = getRouterParam(event, 'date')

  if (!id || !rawDateWithXmlEnding) {
    throw createError({ statusCode: 422, message: 'No ID or Date provided' })
  }

  if(!rawDateWithXmlEnding.endsWith('.xml')) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const date = rawDateWithXmlEnding.slice(0, -4)

  const creditor = await getCreditorDetails()
  // Get payment details
  const paymentDetails = await getPaymentDetails(id)
  // Pass them to createXmlForSepaPayment

  setResponseHeader(event, 'content-type', 'application/xml')

  return createXmlForSepaPayment({
    ...paymentDetails,
    creditor,
    collectionDate: new Date(date),
  })
})

// TODO: Update the function to use the correct data
async function getCreditorDetails() {
  return {
    name: 'Test',
    iban: 'NL45ABNA8818556967',
    bic: 'ABNANL2A',
    id: 'DE98ZZZ09999999999',
  }
}

type Payee = InternalApi['/api/finances/payments/:id']['get']['payees'][0]
type Member = InternalApi['/api/members']['get'][0]
async function getPaymentDetails(id: string): Promise<{ members: SepaMemberEntry[]; notes: string }> {
  const [payment, members] = await Promise.all([$fetch(`/api/finances/payments/${id}`), $fetch('/api/members')])
  return {
    members: payment.payees.map(p => {
      const memberForPayee = members.find(m => m.id === p.memberId)
      if(!memberForPayee) {
        throw new Error(`Member with ID ${p.memberId} not found`)
      }
      if(memberForPayee.paymentType !== 'sepa') {
        return
      }
      return transformPayeeToMember({...memberForPayee, ...p})
  }).filter((x): x is SepaMemberEntry => Boolean(x)),
    notes: '', //payment.notes,
  }
}

function transformPayeeToMember(payee: Payee & Member): SepaMemberEntry { 
  return {
    firstName: payee.firstName,
    lastName: payee.lastName,
    iban: payee.sepaIban!,
    bic: payee.sepaBic!,
    mandate: {
      id: payee.sepaMandateId!,
      signatureDate: payee.sepaMandateDate!,
    },
    amountInCents: payee.paymentAmount
  }
}