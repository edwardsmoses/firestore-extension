import EmojiPicker from "emoji-picker-react"
import {
  Anchor,
  Box,
  Button,
  DropButton,
  FormField,
  Grommet,
  Nav,
  TextInput
} from "grommet"
import type { PlasmoContentScript } from "plasmo"
import { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import styleText from "data-text:./settings.css"
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

//TODOs: Only Display the Settings on the elements resembling an Id (possibly use Regex)
//In the Future, allow for customized Regex..

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
          className="elevate-field-settings-btn"
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
  const DEFAULT_EMOJI_ICON = "????"
  const [targetCollection, setTargetCollection] = useState("")
  const [emojiIcon, setEmojiIcon] = useState(DEFAULT_EMOJI_ICON)

  const [selectedTarget, setSelectedTarget] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const storageKey = generateStorageKey({
    documentName,
    fieldName,
    projectId
  })

  const storage = useStorage(storageKey)
  const existingTargetOptions = (storage[0] as TargetCollection[]) || []

  const handleSave = async () => {
    setProcessing(true)

    try {
      const storage = new Storage()

      const target: TargetCollection = {
        target: targetCollection,
        icon: emojiIcon
      }

      let existing = false

      let updatedTargetOptions: TargetCollection[] = existingTargetOptions.map(
        (target) => {
          if ([selectedTarget, targetCollection].includes(target.target)) {
            existing = true
            return {
              icon: emojiIcon,
              target: targetCollection
            }
          }
          return target
        }
      )

      if (!existing) {
        updatedTargetOptions = [...updatedTargetOptions, target]
      }

      await storage.set(storageKey, updatedTargetOptions)

      setTargetCollection("")
      setEmojiIcon(DEFAULT_EMOJI_ICON)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Box pad="large" background="light-2">
      <Nav>
        {(existingTargetOptions || []).map((option) => {
          return (
            <Anchor
              key={option.target}
              icon={<div>{option.icon}</div>}
              onClick={() => {
                setSelectedTarget(option.target)
                setEmojiIcon(option.icon)
                setTargetCollection(option.target)
              }}
            />
          )
        })}
        <Anchor
          icon={<div>+</div>}
          onClick={() => {
            setTargetCollection("")
            setEmojiIcon(DEFAULT_EMOJI_ICON)
          }}
        />
      </Nav>

      <div>
        <Button
          type="button"
          onClick={() => {
            setIsEmojiPickerOpen((prev) => !prev)
          }}>
          {emojiIcon}
        </Button>
        {isEmojiPickerOpen && (
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setEmojiIcon(emoji.emoji)
              setIsEmojiPickerOpen(false)
            }}
          />
        )}
      </div>

      <FormField label="Target Collection">
        <TextInput
          placeholder="enter the collection you want to target"
          value={targetCollection}
          onChange={(event) => setTargetCollection(event.target.value)}
        />
      </FormField>
      <Button primary label="Save" disabled={processing} onClick={handleSave} />
    </Box>
  )
}

export default PlasmoInline
