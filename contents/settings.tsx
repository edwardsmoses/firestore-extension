import styleText from "data-text:./settings.css"
import type { PlasmoGetStyle, PlasmoCSConfig } from "plasmo"

import { AppContainer } from "~/components/AppContainer"
import { AppDropButton } from "~/components/AppDropButton"
import { FirestoreTargetCollectionsList } from "~components/FirestoreTargetCollectionsList"
import { SettingsPopup } from "~components/Settings"
import { generateStorageKey, getCurrentProject } from "~utils/utils"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://console.firebase.google.com/*"],
  css: ["font.css"]
}

//TODOs: Only Display the Settings on the elements resembling an Id (possibly use Regex)
//In the Future, allow for customized Regex..

export const getInlineAnchorList = async () => {
  const elements = document.querySelectorAll("div.database-node")
  return elements
}

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-settings-id"

const PlasmoInline = (props) => {
  const { anchor } = props

  const databaseFieldElement = anchor.element as HTMLDivElement

  const fieldKey =
    databaseFieldElement.childNodes[1].childNodes[1].childNodes[3].textContent
  const fieldValue = (
    databaseFieldElement.childNodes[1]?.childNodes[1]?.childNodes[5]
      ?.textContent || ""
  ).replace(/['"]/g, "")

  //get the current project from the URL
  const currentProject = getCurrentProject()

  //get the current document from the URL
  const currentURL = window.location.href
  const urlArray = currentURL.split("/")

  //TODO Look into if there's another way to get the document info from the url
  const currentDocument = urlArray[urlArray.length - 1]
    .split("~")[1]
    .replace("2F", "")

  const storageKey = generateStorageKey({
    documentName: currentDocument,
    fieldName: fieldKey,
    projectId: currentProject
  })

  return (
    <AppContainer>
      <>
        <FirestoreTargetCollectionsList
          currentProject={currentProject}
          fieldValue={fieldValue}
          storageKey={storageKey}
        />

        <AppDropButton
          btnLabel="Settings"
          btnDropContent={<SettingsPopup storageKey={storageKey} />}
        />
      </>
    </AppContainer>
  )
}

export default PlasmoInline
