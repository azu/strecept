import { Ctx } from "blitz"
import db, { ReceiptUpdateArgs } from "db"

type UpdateReceiptInput = Pick<ReceiptUpdateArgs, "where" | "data">;

export default async function updateReceipt({ where, data }: UpdateReceiptInput, ctx: Ctx) {
  ctx.session.authorize()

  const receipt = await db.receipt.update({ where, data })

  return receipt
}
