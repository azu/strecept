import React, { Suspense } from "react";
import Layout from "app/layouts/Layout";
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz";
import getReceipt from "app/receipts/queries/getReceipt";
import updateReceipt from "app/receipts/mutations/updateReceipt";
import ReceiptForm from "app/receipts/components/ReceiptForm";
import { assertReceipt } from "../../../util/assertReceipt"
import { View } from "../../../../components/View"

export const EditReceipt = () => {
  const router = useRouter();
  const receiptId = useParam("receiptId", "number");
  const [receipt, { mutate }] = useQuery(getReceipt, { where: { id: receiptId } });
  const [updateReceiptMutation] = useMutation(updateReceipt);
  assertReceipt(receipt);
  return (
    <div>
      <h1>Edit Receipt {receipt.id}</h1>
      <pre>{JSON.stringify(receipt)}</pre>
      <ReceiptForm
        initialValues={receipt}
        onSubmit={async (state) => {
          try {
            const updated = await updateReceiptMutation({
              where: { id: receipt.id },
              data: state,
            });
            await mutate(updated);
            router.push("/receipts/[receiptId]", `/receipts/${updated.id}`);
          } catch (error) {
            console.error(error);
            alert("Error creating receipt " + JSON.stringify(error, null, 2));
          }
        }}
      />
    </div>
  );
};

const EditReceiptPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditReceipt />
      </Suspense>
      <View>
        <Link href="/receipts">
          <a>Back to Receipts</a>
        </Link>
      </View>
    </div>
  );
};

EditReceiptPage.getLayout = (page) => <Layout title={"Edit Receipt"}>{page}</Layout>;

export default EditReceiptPage;
