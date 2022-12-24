import { Box, Button, DropButton, FormField, Grommet, TextInput } from "grommet"
import type { PlasmoContentScript } from "plasmo"
import { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

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
  //TODO Temp values...
  const PROJECT_NAME = "edwards"
  const FIELD_NAME = "userId"

  const [targetOptions] = useStorage(`${PROJECT_NAME}_${FIELD_NAME}`)
  console.log("options saved", targetOptions)

  return (
    <Grommet>
      <DropButton
        primary
        label="Settings"
        dropContent={
          <SettingsBox fieldName={FIELD_NAME} projectName={PROJECT_NAME} />
        }
      />
    </Grommet>
  )
}

type SettingsProps = {
  projectName: string
  fieldName: string
}
const SettingsBox = ({ projectName, fieldName }: SettingsProps) => {
  const [targetCollection, setTargetCollection] = useState("")
  const [emojiIcon, setEmojiIcon] = useState("")

  const handleSave = async () => {
    const storage = new Storage()

    await storage.set(`${projectName}_${fieldName}`, [
      {
        target: targetCollection,
        icon: emojiIcon
      }
    ])
  }

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
      <Button primary label="Save" onClick={handleSave} />
    </Box>
  )
}

export default PlasmoInline
