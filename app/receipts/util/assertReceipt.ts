import { Receipt } from "@prisma/client"

export type ReceiptWithJSON = Receipt & {
  viewInfo: {
    blurHash: string;
  }
}

export function assertReceipt(receipt: Receipt): asserts receipt is ReceiptWithJSON {
  if ("viewInfo" in receipt) {
    return
  }
  throw new Error("viewInfo is not Found")

}
