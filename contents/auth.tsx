import styleText from "data-text:./settings.css"
import type { PlasmoContentScript } from "plasmo"
import type { PlasmoGetStyle } from "plasmo"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"],
  css: ["font.css"]
}

export const getInlineAnchor = async () => {

  // > mat-card-content > th 
  const elements = document.querySelectorAll(
    "authentication-users  mat-card th > div.mat-sort-header-container"
  )

  //we're targeting the last column - 'User Uid' in the Table Header in the Authentication page
  const lastColumnHeader = elements[elements.length - 1];
  return lastColumnHeader;
}

// Use this to optimize unmount lookups
export const getShadowHostId = () => "firebase-elevate-auth-settings-id"

const AuthSettingsInline = (props) => {
  const { anchor } = props

  return <button>Settings</button>
}

export default AuthSettingsInline
