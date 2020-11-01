import { Ctx } from "blitz";
import db, { ReceiptDeleteArgs } from "db";

type DeleteReceiptInput = Pick<ReceiptDeleteArgs, "where">;

export default async function deleteReceipt({ where }: DeleteReceiptInput, ctx: Ctx) {
  ctx.session.authorize();

  const receipt = await db.receipt.delete({ where });

  return receipt;
}
