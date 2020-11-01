import { Link, BlitzPage, useMutation, useQuery } from "blitz"
import Layout from "app/layouts/Layout"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { CSSProperties, ReactNode, Suspense } from "react"
import getPublicReceipts from "../receipts/queries/getPublicReceipts"
import { Blurhash } from "react-blurhash"

const View = (props: { style?: CSSProperties; children: ReactNode }) => {
  return <div className={"View"} style={{
    padding: "0.5rem",
    ...props.style
  }}>
    {props.children}
  </div>
}
const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  return (<>
      <View>
        <Link href="/receipts">
          <a>
            <strong>Receipts</strong>
          </a>
        </Link>
      </View>
      <View>
        <code>{currentUser?.name ?? ""}</code>
      </View>
      <View>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
      </View>
    </>
  )
}
const RecentReceipts = () => {
  const [publicReceipts] = useQuery(getPublicReceipts, {})
  const receipts = publicReceipts.receipts
  return (
    <div className={"RecentReceipts"} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end"
    }}>
      {receipts.map(receipt => {
        return <View key={receipt.id}>
          <h3><a href={receipt.url}>{receipt.title}</a></h3>
          <Blurhash
            hash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
            width={400}
            height={300}
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </View>
      })}
    </div>
  )
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <header style={{
        display: "flex",
        flexDirection: "row"
      }}>
        <View style={{
          flex: 1
        }}>
          <h1>Strecept</h1>
        </View>
        <div className={"UserInfo"} style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end"
        }}>
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
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
