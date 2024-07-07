export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const date = getRouterParam(event, 'date')

  if(!id || !date) {
    throw createError({ statusCode: 422, message: 'No ID or Date provided' })
  }

  // TODO:
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