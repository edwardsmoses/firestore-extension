import { Box, Button, DropButton, FormField, Grommet, TextInput } from "grommet"
import type { PlasmoContentScript, PlasmoRender } from "plasmo"
import { useRef, useState } from "react"
import { createRoot } from "react-dom/client"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"]
}

//TODOs: Only Display the Settings on the elements resembling an Id (possibly use Regex)
//In the Future, only for customized Regex..

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

  console.log("field info", fieldKey, fieldValue)

  //TODO Temp values...
  const PROJECT_NAME = "edwards"
  const FIELD_NAME = "userId"

  //get the current project from the URL
  const currentURL = window.location.href
  const currentProject = currentURL.split("/")[6]

  const [targetOptions] = useStorage(`${PROJECT_NAME}_${FIELD_NAME}`)
  console.log("saved options", targetOptions)

  return (
    <Grommet>
      <div>
        {(targetOptions || []).map((option) => {
          return (
            <Button
              key={option.target}
              href={`/project/${currentProject}/firestore/data/${option.target}/${fieldValue}`}
              primary>
              {option.icon}
            </Button>
          )
        })}
        <DropButton
          primary
          label="Settings"
          dropContent={
            <SettingsBox fieldName={FIELD_NAME} projectName={PROJECT_NAME} />
          }
        />
      </div>
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
    <Box pad="large" background="light-2">
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
