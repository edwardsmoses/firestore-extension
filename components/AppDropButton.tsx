import { DropButton } from "grommet"

export const AppDropButton = ({
  btnLabel,
  btnDropContent
}: {
  btnLabel: string
  btnDropContent: JSX.Element
}) => {
  return (
    <DropButton
      primary
      label={btnLabel}
      className="elevate-field-settings-btn"
      dropProps={{
        style: {
          fontFamily: "var(--firebase-elevate-font)",
          borderRadius: "25px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        }
      }}
      dropContent={btnDropContent}
    />
  )
}
