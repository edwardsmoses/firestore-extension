import { Box, DropButton, Grommet } from "grommet"
import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"]
}

export const getInlineAnchorList = async () => {
  const elements = document.querySelectorAll("div.database-node")
  console.log("anchor", elements)
  return elements
}

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-settings-id"

const PlasmoInline = () => {
  return (
    <Grommet>
      <DropButton
        label="Settings ->"
        dropContent={<Box pad="large" background="light-2" />}
      />
    </Grommet>
  )
}

export default PlasmoInline
