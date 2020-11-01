import { Ctx } from "blitz"
import db  from "db"
export default async function getPublicReceipts(_, ctx: Ctx) {
  const receipts = await db.receipt.findMany({
    take: 5
  })
  const count = await db.receipt.count()
  return {
    receipts,
    count
  }
}
