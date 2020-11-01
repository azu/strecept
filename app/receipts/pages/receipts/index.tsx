import React, { Suspense } from "react";
import Layout from "app/layouts/Layout";
import { Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz";
import getReceipts from "app/receipts/queries/getReceipts";

const ITEMS_PER_PAGE = 100;

export const ReceiptsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ receipts, hasMore }] = usePaginatedQuery(getReceipts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {receipts.map((receipt) => (
          <li key={receipt.id}>
            <Link href="/receipts/[receiptId]" as={`/receipts/${receipt.id}`}>
              <a>{receipt.title}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const ReceiptsPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/receipts/new">
          <a>Create Receipt</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <ReceiptsList />
      </Suspense>
    </div>
  );
};

ReceiptsPage.getLayout = (page) => <Layout title={"Receipts"}>{page}</Layout>;

export default ReceiptsPage;
