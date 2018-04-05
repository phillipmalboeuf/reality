
import * as React from "react"
import { Button } from "../components/button"

interface Props {}

export const Connect: React.SFC<Props> = (props) => {
  return <div className="hero">
    <div className="hero__content">
      <h1>Reality</h1>
      <p>MongoDB Editor and Real-time Aggregator</p>
      <Button to={`db`} label="Connect" />
    </div>
  </div>
}