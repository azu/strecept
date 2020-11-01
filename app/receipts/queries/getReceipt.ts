import { Ctx, NotFoundError } from "blitz";
import db, { FindFirstReceiptArgs } from "db";

type GetReceiptInput = Pick<FindFirstReceiptArgs, "where">;

export default async function getReceipt({ where }: GetReceiptInput, ctx: Ctx) {
  ctx.session.authorize();
  const receipt = await db.receipt.findFirst({ where });
  if (!receipt) throw new NotFoundError();
  return receipt;
}
