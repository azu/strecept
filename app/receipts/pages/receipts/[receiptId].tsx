import React, { Suspense } from "react";
import Layout from "app/layouts/Layout";
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz";
import getReceipt from "app/receipts/queries/getReceipt";
import deleteReceipt from "app/receipts/mutations/deleteReceipt";

export const Receipt = () => {
  const router = useRouter();
  const receiptId = useParam("receiptId", "number");
  const [receipt] = useQuery(getReceipt, { where: { id: receiptId } });
  const [deleteReceiptMutation] = useMutation(deleteReceipt);

  return (
    <div>
      <h1>Receipt {receipt.id}</h1>
      <pre>{JSON.stringify(receipt, null, 2)}</pre>

      <Link href="/receipts/[receiptId]/edit" as={`/receipts/${receipt.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteReceiptMutation({ where: { id: receipt.id } });
            router.push("/receipts");
          }
        }}
      >
        Delete
      </button>
    </div>
  );
};

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
  );
};

ShowReceiptPage.getLayout = (page) => <Layout title={"Receipt"}>{page}</Layout>;

export default ShowReceiptPage;
