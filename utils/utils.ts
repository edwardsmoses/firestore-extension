import type { StorageKeyArgs } from "./types"

export const generateStorageKey = ({
  projectId,
  documentName,
  fieldName
}: StorageKeyArgs) => {
  return `${projectId}_${documentName}_${fieldName}`
}

export const getCurrentProject = () => {
  //get the current project from the URL
  const currentURL = window.location.href

  const urlArray = currentURL.split("/")
  const currentProject = urlArray[6] || ""

  return currentProject
}
