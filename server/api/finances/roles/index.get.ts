import { asc, desc } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const columnToSort = query.sort as string
  const order = query.order as string

  const sortValues = getMappedColumn(columnToSort, order)

  const builder = useDrizzle()
    .select()
    .from(tables.paymentRoles)

  if (!sortValues) {
    return await builder
  }
  return await builder.orderBy(sortValues.orderFn(sortValues?.column))
})

const ORDER_FN: Record<string, typeof asc | typeof desc> = {
  asc,
  desc,
} as const

function getMappedColumn(columnToSort?: string, order?: string) {
  if (!columnToSort) {
    return undefined
  }

  const column = columnToSort === 'name' ? tables.paymentRoles.name : tables.paymentRoles.amount 

  const orderFn = !order
    ? asc
    : order in ORDER_FN
      ? ORDER_FN[order]
      : asc

  return {
    column,
    orderFn,
  }
}