export async function checkForPaymentRole(input: unknown) {
  const roles = await $fetch('/api/finances/roles')
  if (roles.some(r => r.id === Number(input))) {
    return
  }
  throw createError({ statusCode: 400, message: 'Invalid payment role' })
}