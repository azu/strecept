import React, { Suspense } from "react";
import Layout from "app/layouts/Layout";
import { Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz";
import getReceipts from "app/receipts/queries/getReceipts";
import { View } from "../../../components/View";
import { Blurhash } from "react-blurhash";
import { assertReceipt } from "../../util/assertReceipt";

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
    <div
      className={"Receipts"}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {receipts.map((receipt) => {
        assertReceipt(receipt);
        return (
          <View key={receipt.id} style={{ width: "100%" }}>
            <h3>
              <a href={receipt.url}>{receipt.title}</a>
              <Link href="/receipts/[receiptId]" as={`/receipts/${receipt.id}`}>
                <a href={receipt.url}>
                  <span role={"img"} aria-label="Edit">
                    📝
                  </span>
                </a>
              </Link>
            </h3>
            <Blurhash
              hash={receipt.viewInfo.blurHash ?? "LKO2?U%2Tw=w]~RBVZRi};RPxuwH"}
              width={400}
              height={300}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          </View>
        );
      })}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View>
          <button disabled={page === 0} onClick={goToPreviousPage}>
            Prev
          </button>
        </View>
        <View>
          <button disabled={!hasMore} onClick={goToNextPage}>
            Next
          </button>
        </View>
      </div>
    </div>
  );
};

const ReceiptsPage: BlitzPage = () => {
  return (
    <div className="container">
      <header
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <h1>
            <Link href={"/"}>Strecept</Link>
          </h1>
        </View>
        <div
          className={"UserInfo"}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Link href="/receipts/new">
            <a>Create Receipt</a>
          </Link>
        </div>
      </header>
      <p></p>
      <main>
        <View>
          <h2>Your Receipts</h2>
        </View>
        <Suspense fallback={<div>Loading...</div>}>
          <ReceiptsList />
        </Suspense>
      </main>
      <footer>Footer Content</footer>
    </div>
  );
};

ReceiptsPage.getLayout = (page) => <Layout title={"Receipts"}>{page}</Layout>;

export default ReceiptsPage;
