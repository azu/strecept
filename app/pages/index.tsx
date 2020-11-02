import { BlitzPage, Link, useMutation, useQuery } from "blitz";
import Layout from "app/layouts/Layout";
import logout from "app/auth/mutations/logout";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import { Suspense } from "react";
import getPublicReceipts from "../receipts/queries/getPublicReceipts";
import { Blurhash } from "react-blurhash";
import { View } from "../components/View";

const UserInfo = () => {
  const currentUser = useCurrentUser();
  const [logoutMutation] = useMutation(logout);
  return (
    <>
      <View>
        <Link href="/receipts">
          <a>
            <strong>Receipts</strong>
          </a>
        </Link>
      </View>
      <View>
        <code>{currentUser?.name ?? "Guest"}</code>
      </View>
      {currentUser ? (
        <View>
          <button
            className="button small"
            onClick={async () => {
              await logoutMutation();
            }}
          >
            Logout
          </button>
        </View>
      ) : (
        <>
          <View>
            <Link href={"/signup"}>
              <button className="button small">Signup</button>
            </Link>
          </View>
          <View>
            <Link href={"/login"}>
              <button className="button small">Login</button>
            </Link>
          </View>
        </>
      )}
    </>
  );
};
type ViewInfo = { blurHash: string };
const RecentReceipts = () => {
  const [publicReceipts] = useQuery(getPublicReceipts, {});
  const receipts = publicReceipts.receipts;
  return (
    <div
      className={"RecentReceipts"}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {receipts.map((receipt) => {
        return (
          <View key={receipt.id} style={{ width: "100%" }}>
            <h3>
              <a href={receipt.url}>{receipt.title}</a>
            </h3>
            <Blurhash
              hash={(receipt.viewInfo as ViewInfo).blurHash ?? "LKO2?U%2Tw=w]~RBVZRi};RPxuwH"}
              width={400}
              height={300}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          </View>
        );
      })}
    </div>
  );
};

const Home: BlitzPage = () => {
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
          <Suspense fallback={<div />}>
            <UserInfo />
          </Suspense>
        </div>
      </header>
      <main>
        <View>
          <h2>Users Receipts</h2>
        </View>
        <Suspense fallback="Loading...">
          <RecentReceipts />
        </Suspense>
      </main>
      <footer>Footer Content</footer>
    </div>
  );
};

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
