import { asc, desc } from "drizzle-orm";

type Column = keyof typeof tables.members.$inferInsert;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const columnToSort = query.sort as string;
  const order = query.order as string;

  if (!Object.keys(tables.members).includes(columnToSort)) {
    throw createError({
      message: "Invalid column name",
      status: 400,
    });
  }

  const sortValues = getMappedColumn(columnToSort as Column, order);

  const builder = useDrizzle().select().from(tables.members);

  if (!sortValues) {
    return await builder;
  }
  return await builder.orderBy(sortValues.orderFn(sortValues?.column));
});

const ORDER_FN: Record<string, typeof asc | typeof desc> = {
  asc,
  desc,
} as const;

function getMappedColumn(columnToSort?: Column, order?: string) {
  if (!columnToSort) {
    return undefined;
  }

  const column = tables.members[columnToSort];

  const orderFn = !order ? asc : order in ORDER_FN ? ORDER_FN[order] : asc;

  return {
    column,
    orderFn,
  };
}
