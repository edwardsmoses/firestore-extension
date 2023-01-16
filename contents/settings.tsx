import styleText from "data-text:./settings.css"
import EmojiPicker from "emoji-picker-react"
import {
  Anchor,
  Box,
  Button,
  DropButton,
  FormField,
  Grommet,
  Nav,
  Text,
  TextInput
} from "grommet"
import type { PlasmoContentScript } from "plasmo"
import type { PlasmoGetStyle } from "plasmo"
import { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

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
          dropProps={{
            style: {
              fontFamily: "var(--firebase-elevate-font)",
              borderRadius: "25px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            }
          }}
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
  const DEFAULT_EMOJI_ICON = "😀"
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
    <Box pad="medium">
      <style>
        {`
          
.eroNgb:focus {
  box-shadow: none !important;
}

.elevate-field-settings-header-btn {
  display: flex;
  border-radius: 11px;
  border-color: var(--firebase-elevate-brand-black);
  width: 25px;
  height: 25px;
  border-width: 2px;
  color: var(--firebase-elevate-brand-black);
  border-style: solid;
  font-size: 13px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3px;
}

.elevate-field-settings-header-btn-selected {
  border-color: var(--firebase-elevate-brand);
  border-width: 3px;
  border-style: dotted;
  border-radius: 7px;
}

.elevate-field-settings-header-btn:hover {
  text-decoration: none;
  background-color: rgba(51, 51, 51, 0.05);
}

.elevate-divider {
  border-color: #ababab;
  border-bottom-width: 1.7px;
  color: var(--firebase-elevate-brand-black);
  border-bottom-style: solid;
  padding-bottom: 10px;
  margin-bottom: 12px;
  margin-left: 2%;
  margin-right: 30%;
}

          `}
      </style>

      <Box direction="row" gap="6px" className="elevate-divider">
        {(existingTargetOptions || []).map((option) => {
          return (
            <Anchor
              key={option.target}
              className={`elevate-field-settings-header-btn ${
                option.target === selectedTarget
                  ? "elevate-field-settings-header-btn-selected"
                  : ""
              }`}
              icon={<span>{option.icon}</span>}
              onClick={() => {
                setSelectedTarget(option.target)
                setEmojiIcon(option.icon)
                setTargetCollection(option.target)
              }}
            />
          )
        })}
        <Anchor
          icon={<span>+</span>}
          className={`elevate-field-settings-header-btn ${
            selectedTarget === ""
              ? "elevate-field-settings-header-btn-selected"
              : ""
          }`}
          onClick={() => {
            setTargetCollection("")
            setEmojiIcon(DEFAULT_EMOJI_ICON)
          }}
        />
      </Box>

      <div>
        {isEmojiPickerOpen && (
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setEmojiIcon(emoji.emoji)
              setIsEmojiPickerOpen(false)
            }}
          />
        )}
      </div>

      <Box
        direction="row"
        margin={{
          vertical: "4px"
        }}
        style={{
          alignItems: "center"
        }}
        gap="5px">
        <Button
          style={{
            borderRadius: "50px",
            borderColor: "#7a52d3",
            padding: "1px",
            borderWidth: "2.5px",
            borderStyle: "solid"
          }}
          type="button"
          onClick={() => {
            setIsEmojiPickerOpen((prev) => !prev)
          }}>
          {emojiIcon}
        </Button>
        <Text>Related Collection</Text>
      </Box>

      <Box
        margin={{
          horizontal: "5px",
          top: "4px",
          bottom: "6px"
        }}>
        <TextInput
          placeholder="collection name"
          value={targetCollection}
          focusIndicator={false}
          onChange={(event) => setTargetCollection(event.target.value)}
        />
      </Box>

      <Button
        type="button"
        primary
        label="Save"
        disabled={processing}
        onClick={handleSave}
      />
    </Box>
  )
}

export default PlasmoInline
