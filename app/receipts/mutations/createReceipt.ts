import { Ctx } from "blitz"
import db, { ReceiptCreateArgs } from "db"

type CreateReceiptInput = {
  data: Omit<ReceiptCreateArgs["data"], "user">
};
export default async function createReceipt({ data }: CreateReceiptInput, ctx: Ctx) {
  ctx.session.authorize()

  const receipt = await db.receipt.create({
    data: {
      ...data,
      user: {
        connect: {
          id: ctx.session.userId
        }
      }
    }
  })

  return receipt
}
