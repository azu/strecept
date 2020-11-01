import React from "react";
import Layout from "app/layouts/Layout";
import { Link, useRouter, useMutation, BlitzPage } from "blitz";
import createReceipt from "app/receipts/mutations/createReceipt";
import ReceiptForm from "app/receipts/components/ReceiptForm";

const NewReceiptPage: BlitzPage = () => {
  const router = useRouter();
  const [createReceiptMutation] = useMutation(createReceipt);

  return (
    <div>
      <h1>Create New Receipt</h1>
      <ReceiptForm
        initialValues={{}}
        onSubmit={async () => {
          try {
            const receipt = await createReceiptMutation({
              data: { title: "MyName", url: "https://example.com" },
            });
            alert("Success!" + JSON.stringify(receipt));
            router.push("/receipts/[receiptId]", `/receipts/${receipt.id}`);
          } catch (error) {
            alert("Error creating receipt " + JSON.stringify(error, null, 2));
          }
        }}
      />

      <p>
        <Link href="/receipts">
          <a>Receipts</a>
        </Link>
      </p>
    </div>
  );
};

NewReceiptPage.getLayout = (page) => <Layout title={"Create New Receipt"}>{page}</Layout>;

export default NewReceiptPage;
