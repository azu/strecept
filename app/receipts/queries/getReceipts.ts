import { Ctx } from "blitz";
import db, { FindManyReceiptArgs } from "db";

type GetReceiptsInput = Pick<FindManyReceiptArgs, "where" | "orderBy" | "skip" | "take">;

export default async function getReceipts({ where, orderBy, skip = 0, take }: GetReceiptsInput, ctx: Ctx) {
  ctx.session.authorize();

  const receipts = await db.receipt.findMany({
    where,
    orderBy,
    take,
    skip,
  });

  const count = await db.receipt.count();
  const hasMore = typeof take === "number" ? skip + take < count : false;
  const nextPage = hasMore ? { take, skip: skip + take! } : null;

  return {
    receipts,
    nextPage,
    hasMore,
    count,
  };
}
