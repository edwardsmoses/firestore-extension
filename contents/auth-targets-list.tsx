import authStyleText from "data-text:./auth.css"
import styleText from "data-text:./settings.css"
import type { PlasmoContentScript } from "plasmo"
import type { PlasmoGetStyle } from "plasmo"

import { AppContainer } from "~/components/AppContainer"
import { FirestoreTargetCollectionsList } from "~components/FirestoreTargetCollectionsList"
import { generateStorageKey, getCurrentProject } from "~utils/utils"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText + authStyleText
  return style
}

export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"],
  css: ["font.css"]
}

export const getInlineAnchorList = async () => {
  //we're targeting the last column(s) - 'User Uid' in the Users Table in the Authentication Page
  const elements = document.querySelectorAll(
    "authentication-users mat-card #auth-users-table td.mat-column-uid > div"
  )

  return elements
}

// Use this to optimize unmount lookups
export const getShadowHostId = () =>
  "firebase-elevate-auth-settings-targets-list-id"

const AuthSettingsInline = (props) => {
  const { anchor } = props

  const currentProject = getCurrentProject()

  const storageKey = generateStorageKey({
    projectId: currentProject,
    documentName: "firebase",
    fieldName: "auth"
  });

  const userUIDFieldElement = anchor.element as HTMLDivElement
  const userUIDFieldValue = userUIDFieldElement.textContent.trim();

  return (
    <AppContainer>
      <FirestoreTargetCollectionsList
        currentProject={currentProject}
        fieldValue={userUIDFieldValue}
        storageKey={storageKey}
      />
    </AppContainer>
  )
}

export default AuthSettingsInline
