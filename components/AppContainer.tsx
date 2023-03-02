import { Grommet } from "grommet"

export const AppContainer = ({ children }: { children: JSX.Element }) => {
  return (
    <Grommet>
      <div className="elevate-field-targets-container">{children}</div>
    </Grommet>
  )
}
