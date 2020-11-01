import React, { useCallback, useEffect, useState } from "react"
import { ReceiptWithJSON } from "../util/assertReceipt"
import { encode } from "blurhash"
import { Blurhash } from "react-blurhash"
import { View } from "../../components/View"

const loadImage = async (src: string) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = ""
    img.onload = () => resolve(img)
    img.onerror = (...args) => reject(args)
    img.src = src
  })

const getImageData = image => {
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext("2d")
  context?.drawImage(image, 0, 0)
  return context?.getImageData(0, 0, image.width, image.height)
}

const encodeImageToBlurhash = async (imageUrl: string) => {
  const image = await loadImage(imageUrl)
  const imageData = getImageData(image)
  if (!imageData) {
    return
  }
  return encode(imageData.data, imageData.width, imageData.height, 8, 8)
}
const fetchImageBlurhash = async (imgUrl: string) => {
  // https://robwu.nl/cors-anywhere.html avoid CORS
  return encodeImageToBlurhash(`https://cors-anywhere.herokuapp.com/${imgUrl}`)
}
export type ReceiptFormProps = {
  initialValues: Partial<Pick<ReceiptWithJSON, "title" | "url" | "viewInfo">> & {
    heroImgUrl?: string;
  };
  onSubmit: ({ title, url }: Pick<ReceiptWithJSON, "title" | "url" | "viewInfo">) => void;
};

const ReceiptForm = ({ initialValues, onSubmit }: ReceiptFormProps) => {
  const [state, setState] = useState({
    title: initialValues?.title ?? "",
    url: initialValues?.url ?? "",
    heroImgUrl: initialValues.heroImgUrl ?? "",
    blurHash: initialValues?.viewInfo?.blurHash ?? ""
  })
  const [isFeching, setIsFetching] = useState(false)
  const updateBlurHash = async (imgUrl: string) => {
    setIsFetching(true)
    const hash = await fetchImageBlurhash(imgUrl)
    if (hash) {
      setState({
        ...state,
        blurHash: hash
      })
    }
    setIsFetching(false)
  }
  const handleChange = async (event) => {
    setState({ ...state, [event.target.name]: event.target.value })
    if (event.target.name === "heroImgUrl" && state.blurHash === "") {
      updateBlurHash(event.target.value)
    }
  }
  useEffect(() => {
    if (state.heroImgUrl) {
      updateBlurHash(state.heroImgUrl)
    }
  }, [])
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({
          title: state.title,
          url: state.url,
          viewInfo: {
            heroImgUrl: state.heroImgUrl,
            blurHash: state.blurHash
          }
        })
      }}
    >
      <View>
        <label>
          <p>Title</p>
          <input
            type="text"
            placeholder="title"
            name={"title"}
            value={state.title}
            onChange={handleChange}
            style={{ width: "20em" }} />
        </label>
      </View>
      <View>
        <label>
          <p>URL</p>
          <input type="url"
                 placeholder="https://exampole.com"
                 name={"url"}
                 value={state.url}
                 onChange={handleChange}
                 style={{ width: "20em" }}
          />
        </label>
      </View>
      <View>
        <label>
          <p>Hero Image URL</p>
          <input type="url"
                 placeholder="https://example.com/img.png"
                 name={"heroImgUrl"}
                 value={state.heroImgUrl}
                 onChange={handleChange}
                 style={{ width: "20em" }} />
        </label>
      </View>
      <View>
        <label>
          <p>Hash</p>
          <input type="text" placeholder="blur hash"
                 name={"blurHash"}
                 value={state.blurHash}
                 onChange={handleChange}
                 disabled={true}
                 style={{ width: "20em" }}
          />
        </label>
      </View>
      {state.blurHash
        ? <View>
          <Blurhash hash={state.blurHash} />
        </View>
        : null
      }
      <View>
        <button disabled={isFeching}>Submit</button>
      </View>
    </form>
  )
}

export default ReceiptForm
