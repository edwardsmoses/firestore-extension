import { Button } from "grommet"

import { useStorage } from "@plasmohq/storage/hook"

import type { TargetCollection } from "~utils/types"

export const FirestoreTargetCollectionsList = ({
  storageKey,
  currentProject,
  fieldValue
}: {
  storageKey: string
  currentProject: string
  fieldValue: string
}) => {
  const storage = useStorage(storageKey)
  const targetOptions = storage[0] as TargetCollection[]

  return (
    <>
      {(targetOptions || []).map((option) => {
        return (
          <Button
            key={option.target}
            title={option.target}
            className="elevate-field-targets"
            href={`/project/${currentProject}/firestore/data/${option.target}/${fieldValue}`}
            primary>
            {option.icon}
          </Button>
        )
      })}
    </>
  )
}
