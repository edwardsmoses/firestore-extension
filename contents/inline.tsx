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
  const databaseFieldNodes = document.querySelectorAll(
    "div.database-node-click-target"
  )

  databaseFieldNodes.forEach((fieldNode) => {
    const fieldValue = fieldNode.querySelector(
      "span.database-leaf-value.ng-star-inserted"
    )
    const fieldDatabaseButtons = fieldNode.querySelector("div.database-buttons")

    if (!fieldDatabaseButtons.querySelector("#navigator-btn")) {
      console.log(fieldValue.childNodes.item(0).nodeValue)

      const fieldSpan = fieldNode.childNodes.item(0)

      const container = document.createElement("div")
      container.id = "navigator-btn"

      fieldDatabaseButtons.insertBefore(
        container,
        fieldDatabaseButtons.childNodes.item(0)
      )

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
  return <a className="flex-none w-full font-medium underline">Go</a>
}

export default IdInline
