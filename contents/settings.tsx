import '@webcomponents/custom-elements'


import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Box, Button, DropButton, FormField, Grommet, TextInput } from "grommet"
import type { PlasmoContentScript } from "plasmo"
import { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"


export const config: PlasmoContentScript = {
  matches: ["https://console.firebase.google.com/*"],
}

//TODOs: Only Display the Settings on the elements resembling an Id (possibly use Regex)
//In the Future, only for customized Regex..

export const getInlineAnchorList = async () => {
  const elements = document.querySelectorAll("div.database-node")
  return elements
}

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-settings-id"

type TargetCollection = {
  target: string
  icon: string
}

type StorageKeyArgs = {
  projectId: string
  documentName: string
  fieldName: string
}
const generateStorageKey = ({
  projectId,
  documentName,
  fieldName
}: StorageKeyArgs) => {
  return `${projectId}_${documentName}_${fieldName}`
}

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
  const currentURL = window.location.href

  const urlArray = currentURL.split("/")

  const currentProject = urlArray[6] || ""

  //TODO Look into if there's another way to get the document info from the url
  const currentDocument = urlArray[urlArray.length - 1]
    .split("~")[1]
    .replace("2F", "")

  const storage = useStorage(
    generateStorageKey({
      documentName: currentDocument,
      fieldName: fieldKey,
      projectId: currentProject
    })
  )
  const targetOptions = storage[0] as TargetCollection[]

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
            <SettingsBox
              fieldName={fieldKey}
              documentName={currentDocument}
              projectId={currentProject}
            />
          }
        />
      </div>
    </Grommet>
  )
}

type SettingsProps = StorageKeyArgs & {}
const SettingsBox = ({ documentName, fieldName, projectId }: SettingsProps) => {
  const [targetCollection, setTargetCollection] = useState("")
  const [emojiIcon, setEmojiIcon] = useState("")

  const handleSave = async () => {
    const storage = new Storage()

    const storageKey = generateStorageKey({
      documentName,
      fieldName,
      projectId
    })
    const target: TargetCollection = {
      target: targetCollection,
      icon: emojiIcon
    }

    await storage.set(storageKey, [target])
  }

  return (
    <Box pad="large" background="light-2">
      <div>
      <Picker data={data} onEmojiSelect={setEmojiIcon} />
      </div>

      <FormField label="Target Collection">
        <TextInput
          placeholder="enter the collection you want to target"
          value={targetCollection}
          onChange={(event) => setTargetCollection(event.target.value)}
        />
      </FormField>
      <Button primary label="Save" onClick={handleSave} />
    </Box>
  )
}

export default PlasmoInline
