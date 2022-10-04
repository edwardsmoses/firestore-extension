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
      //the value of the Field in the Document...
      //remove the double quotes from the value...
      const databaseFieldValue = (
        fieldValue?.childNodes?.item(0)?.nodeValue || ""
      ).replace(/["']/g, "")

      //get the current project from the URL
      const currentURL = window.location.href
      const currentProject = currentURL.split("/")[6] 


      const container = document.createElement("div")
      container.id = "navigator-btn"

      //insert the "Navigation" button before the Firestore "Edit" button
      fieldDatabaseButtons.insertBefore(
        container,
        fieldDatabaseButtons.childNodes.item(1)
      )

      let root = createRoot(container)
      root.render(
        <IdInline projectName={currentProject} value={databaseFieldValue} />
      )
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
  projectName: string
  value: string
}

const IdInline = ({ projectName, value }: Props) => {
  return (
    <a
      href={`/project/${projectName}/firestore/data/users/${value}`}
      className="flex-none w-full font-medium underline">
      Go
    </a>
  )
}

export default IdInline
