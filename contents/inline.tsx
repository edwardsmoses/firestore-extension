import cssText from "data-text:../style.css"
import type {
  PlasmoContentScript,
  PlasmoGetInlineAnchor,
  PlasmoMountShadowHost
} from "plasmo"
import { createRoot } from "react-dom/client"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const fieldValueSpans = document.querySelectorAll(
    "span.database-leaf-value.ng-star-inserted"
  )

  fieldValueSpans.forEach((fieldValue) => {
    if (!fieldValue.querySelector("#navigator-btn")) {
      const fieldSpan = fieldValue.childNodes.item(0)

      const container = document.createElement("div")
      container.id = "navigator-btn"
      fieldSpan?.replaceWith(container)

      let root = createRoot(container)
      root.render(<IdInline value={fieldSpan.nodeValue} />)
    }
  })

  return null
}

export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  inlineAnchor
}) => {
  inlineAnchor.appendChild(shadowHost)
}

type Props = {
  value: string
}

const IdInline = ({ value }: Props) => {
  return <a className="w-full flex-none font-medium underline">{value}</a>
}

export default IdInline
