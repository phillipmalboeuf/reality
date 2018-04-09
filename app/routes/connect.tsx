
import * as React from "react"
import { Button } from "../components/button"
import { Link } from "react-router-dom"
import { State as Database } from "../routes/database"

interface Props {}
interface State {
  databases: Database[]
}

export class Connect extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      databases: JSON.parse(localStorage.getItem("databases") || "[]")
    }
  }

  public render() {
    return <div className="hero">
      <div className="hero__content">
        <h1>Reality</h1>
        <p>MongoDB Editor and Real-time Aggregator</p>
        {this.state.databases.map((database, index)=> 
          <Link key={index} className="underline" to={`/db/${index}`}>{database.alias}<br/>{database.db_name}</Link>
        )}
      </div>
    </div>
  }
}