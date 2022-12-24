import { Box, Button, DropButton, FormField, Grommet, TextInput } from "grommet"
import type { PlasmoContentScript } from "plasmo"
import { useState } from "react"

export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"]
}

//TODOs: Only Display the Settings on the elements resembling an Id (possibly use Regex)
//In the Future, only for customized Regex..

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
      <DropButton primary label="Settings" dropContent={<SettingsBox />} />
    </Grommet>
  )
}

const SettingsBox = () => {
  
  const [targetCollection, setTargetCollection] = useState("")
  const [emojiIcon, setEmojiIcon] = useState("")

  return (
    <Box pad="xlarge" background="light-2">
      <FormField label="Icon">
        <TextInput
          placeholder="enter the emoji?"
          value={emojiIcon}
          onChange={(event) => setEmojiIcon(event.target.value)}
        />
      </FormField>

      <FormField label="Target Collection">
        <TextInput
          placeholder="enter the collection you want to target?"
          value={targetCollection}
          onChange={(event) => setTargetCollection(event.target.value)}
        />
      </FormField>
      <Button primary label="Save" />
    </Box>
  )
}

export default PlasmoInline
