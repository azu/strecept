import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getReceipt from "app/receipts/queries/getReceipt"
import deleteReceipt from "app/receipts/mutations/deleteReceipt"
import { View } from "../../../components/View"
import { Blurhash } from "react-blurhash"
import { assertReceipt } from "../../util/assertReceipt"

export const Receipt = () => {
  const router = useRouter()
  const receiptId = useParam("receiptId", "number")
  const [receipt] = useQuery(getReceipt, { where: { id: receiptId } })
  const [deleteReceiptMutation] = useMutation(deleteReceipt)
  assertReceipt(receipt)
  return (
    <div>
      <View key={receipt.id} style={{ width: "100%" }}>
        <h2>
          <a href={receipt.url}>{receipt.title}</a>
        </h2>
        <Blurhash
          hash={receipt.viewInfo.blurHash ?? "LKO2?U%2Tw=w]~RBVZRi};RPxuwH"}
          width={400}
          height={300}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      </View>
      <div style={{
        display: "flex",
        flexDirection: "row"
      }}>
        <View>
          <Link href="/receipts/[receiptId]/edit" as={`/receipts/${receipt.id}/edit`}>
            <button>Edit</button>
          </Link>
        </View>
        <View>
          <button
            type="button"
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteReceiptMutation({ where: { id: receipt.id } })
                router.push("/receipts")
              }
            }}
          >
            Delete
          </button>
        </View>
      </div>
    </div>
  )
}

const ShowReceiptPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/receipts">
          <a>Receipts</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Receipt />
      </Suspense>
    </div>
  )
}

ShowReceiptPage.getLayout = (page) => <Layout title={"Receipt"}>{page}</Layout>

export default ShowReceiptPage
