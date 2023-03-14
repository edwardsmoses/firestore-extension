import EmojiPicker from "emoji-picker-react"
import { Anchor, Box, Button, Text, TextInput } from "grommet"
import { useState } from "react"
import { Transition } from "react-transition-group"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { DEFAULT_EMOJI_ICON } from "~utils/constants"
import type { TargetCollection } from "~utils/types"

export const SettingsPopup = ({
  storageKey,
  headerLabel = "Related Collection",
  buttonLabel = "Save"
}: {
  storageKey: string
  headerLabel?: string
  buttonLabel?: string
}) => {
  const [targetCollection, setTargetCollection] = useState("")
  const [emojiIcon, setEmojiIcon] = useState(DEFAULT_EMOJI_ICON)

  const [selectedTarget, setSelectedTarget] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

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

  const defaultStyle = {
    transition: `transform 500ms ease-in-out`,
    transform: "translateY(5px)"
  }

  const transitionStyles = {
    entering: { transform: "translateY(5px)" },
    entered: { transform: "translateY(0px)" }
  }

  return (
    <Box pad="medium">
      <style>
        {`
        
  /* Remove the border on Focus of Text Input */
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
    background-color: var(--firebase-elevate-brand-black-hover);
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
  
  /* Hide the Category Navbar in emoji Picker */
  .epr-category-nav {
    display: none !important;
  }
  
  .EmojiPickerReact {
    margin: 15px 0;
    transition:  opacity 3s ease-in-out;
  }
  
  .relative {
    position: relative;
  }
  
  
  .closeEmojiPickerBtn {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 10px;
    top: -10px;
    cursor: pointer;
  }
  
            `}
      </style>

      <Transition in={isEmojiPickerOpen} timeout={500}>
        {(state) => (
          <>
            <div
              className="relative"
              style={{
                ...defaultStyle,
                ...transitionStyles[state]
              }}>
              {isEmojiPickerOpen && (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    onClick={() => {
                      setIsEmojiPickerOpen(false)
                    }}
                    className="closeEmojiPickerBtn">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <EmojiPicker
                    width="250px"
                    height="250px"
                    categories={[]}
                    previewConfig={{
                      showPreview: false,
                      defaultEmoji: DEFAULT_EMOJI_ICON
                    }}
                    onEmojiClick={(emoji) => {
                      setEmojiIcon(emoji.emoji)
                      setIsEmojiPickerOpen(false)
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </Transition>

      {!isEmojiPickerOpen && (
        <>
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
            <Text>{headerLabel}</Text>
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
            label={buttonLabel}
            disabled={processing}
            onClick={handleSave}
          />
        </>
      )}
    </Box>
  )
}
