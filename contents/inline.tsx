import type {
  PlasmoContentScript,
  PlasmoGetInlineAnchor,
  PlasmoMountShadowHost
} from "plasmo"
import { createRoot } from "react-dom/client"

export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  console.log(
    "are you called",
    document.querySelectorAll("span.database-leaf-value.ng-star-inserted")
  )

  const fieldValueSpans = document.querySelectorAll(
    "span.database-leaf-value.ng-star-inserted"
  );

  fieldValueSpans.forEach((fieldValue) => {
    if (!fieldValue.querySelector("#navigator-btn")) {
      const sendButton = fieldValue.childNodes.item(0)

      const container = document.createElement("div")
      container.id = "navigator-btn"
      sendButton?.parentNode?.insertBefore(container, sendButton.nextSibling)

      let root = createRoot(container)
      root.render(<IdInline />)
    }
  })

  return null;
}

export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  inlineAnchor
}) => {
  inlineAnchor.appendChild(shadowHost)
}

const IdInline = () => {
  return <a>Custom button</a>
}

export default IdInline
