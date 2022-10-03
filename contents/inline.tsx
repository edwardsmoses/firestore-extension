import type {
  PlasmoContentScript,
  PlasmoGetInlineAnchor,
  PlasmoMountShadowHost
} from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  console.log("are you called", document.querySelector("span.database-leaf-value.ng-star-inserted"));
  return document.querySelector("span.database-leaf-value.ng-star-inserted")
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
