import { ArrowRightCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid"
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

      const navigatorContainer = document.createElement("div")
      navigatorContainer.id = "navigator-btn"

      //insert the "Navigation" button before the Firestore "Edit" button
      fieldDatabaseButtons.insertBefore(
        navigatorContainer,
        fieldDatabaseButtons.childNodes.item(2)
      )

      let navigatorRoot = createRoot(navigatorContainer)
      navigatorRoot.render(
        <IdContainerInline
          projectName={currentProject}
          value={databaseFieldValue}
        />
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

type ContainerProps = {
  projectName: string
  value: string
}


const IdContainerInline = ({ projectName, value }: ContainerProps) => {
  return (
    <>
      <IdNavigatorInline projectName={projectName} value={value} />
      <IdSettingsInline projectName="" value="" />
    </>
  )
}

type NavigatorProps = {
  projectName: string
  value: string
}


const IdNavigatorInline = ({ projectName, value }: NavigatorProps) => {
  return (
    <a href={`/project/${projectName}/firestore/data/users/${value}`}>
      <ArrowRightCircleIcon style={{ width: 24, height: 24 }} />
    </a>
  )
}



type SettingsProps = {
  projectName: string
  value: string
}

const IdSettingsInline = ({ projectName, value }: SettingsProps) => {
  return (
    <button>
      <Cog6ToothIcon style={{ width: 24, height: 24 }} />
    </button>
  )
}

export default IdContainerInline
