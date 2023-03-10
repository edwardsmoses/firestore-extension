import authStyleText from "data-text:./auth.css"
import styleText from "data-text:./settings.css"
import type { PlasmoContentScript } from "plasmo"
import type { PlasmoGetStyle } from "plasmo"

import { AppContainer } from "~/components/AppContainer"
import { AppDropButton } from "~/components/AppDropButton"
import { SettingsPopup } from "~components/Settings"
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

export const getInlineAnchor = async () => {
  // > mat-card-content > th
  const elements = document.querySelectorAll(
    "authentication-users mat-card th > div.mat-sort-header-container"
  )

  //we're targeting the last column - 'User Uid' in the Table Header in the Authentication page
  const lastColumnHeader = elements[elements.length - 1]
  return lastColumnHeader
}

// Use this to optimize unmount lookups
export const getShadowHostId = () => "firebase-elevate-auth-settings-id"

const AuthSettingsInline = (props) => {
  const { anchor } = props

  const storageKey = generateStorageKey({
    projectId: getCurrentProject(),
    documentName: "firebase",
    fieldName: "auth"
  })

  return (
    <AppContainer>
      <AppDropButton
        btnLabel="Settings"
        btnDropContent={
          <SettingsPopup
            buttonLabel="Add Target"
            headerLabel="Target Collection"
            storageKey={storageKey}
          />
        }
      />
    </AppContainer>
  )
}

export default AuthSettingsInline
