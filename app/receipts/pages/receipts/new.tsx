import React from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import createReceipt from "app/receipts/mutations/createReceipt"
import ReceiptForm, { ReceiptFormProps } from "app/receipts/components/ReceiptForm"
import { View } from "app/components/View"

const getInitialValuesFromUrl = (urlString: string): Partial<ReceiptFormProps["initialValues"]> => {
  try {
    const url = new URL(urlString)
    return {
      title: url.searchParams.get("title") ?? "",
      heroImgUrl: url.searchParams.get("imgUrl") ?? "",
      url: url.searchParams.get("url") ?? ""
    }
  } catch {
    return {}
  }
}
const NewReceiptPage: BlitzPage = () => {
  const router = useRouter()
  const [createReceiptMutation] = useMutation(createReceipt)
  const initialValues = typeof window !== 'undefined' ? getInitialValuesFromUrl(window.location.href) : {}
  return (
    <div>
      <h1>Create New Receipt</h1>
      <ReceiptForm
        initialValues={initialValues}
        onSubmit={async (state) => {
          try {
            const receipt = await createReceiptMutation({
              data: state
            })
            router.push("/receipts/[receiptId]", `/receipts/${receipt.id}`)
          } catch (error) {
            console.error(error)
            alert("Error creating receipt " + JSON.stringify(error, null, 2))
          }
        }}
      />

      <View>
        <Link href="/receipts">
          <a>Back to Receipts</a>
        </Link>
      </View>
    </div>
  )
}

NewReceiptPage.getLayout = (page) => <Layout title={"Create New Receipt"}>{page}</Layout>

export default NewReceiptPage
