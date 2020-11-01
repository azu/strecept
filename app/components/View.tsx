import { CSSProperties, ReactNode } from "react"

export function View(props: { style?: CSSProperties; children: ReactNode }) {
  return <div className={"View"} style={{
    padding: "0.5rem",
    ...props.style
  }}>
    {props.children}
  </div>
}
