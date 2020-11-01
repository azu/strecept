(async function main() {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight

  function isElementInViewport(el) {
    if (!el) {
      return false
    }
    const rect = el.getBoundingClientRect()
    return (0 < rect.top && rect.top < viewportHeight) ||
      rect.height + rect.top < viewportHeight
  }

  function getMaxImage() {
    let maxDimension = 0
    let maxImage = null
    // Iterate through all the images.
    const imgElements = document.getElementsByTagName("img")
    for (let i = 0; i < imgElements.length; i++) {
      var img = imgElements[i]
      if (!isElementInViewport(img)) {
        continue
      }
      var currDimension = img.width * img.height
      if (currDimension > maxDimension) {
        maxDimension = currDimension
        maxImage = img
      }
    }
    // Check if an image has been found.
    if (maxImage)
      return maxImage.src
    else
      return null
  }

  const heroImage = getMaxImage()
  if (heroImage) {
    console.log("Hero is " + heroImage)
    const param = new URLSearchParams()
    param.append("title", document.title)
    param.append("url", window.location.href)
    param.append("imgUrl", heroImage)
    window.open(`http://localhost:3000/receipts/new?` + param.toString())
  } else {
    console.log("not found")
  }
})()
