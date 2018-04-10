
import * as React from 'react'
import { Button } from '../components/button'
import { Link } from 'react-router-dom'

import Database from '../models/database'


interface Props {}
interface State {
  databases: Database[]
}

export class Connect extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      databases: []
    }
  }

  componentDidMount() {
    Database.list().then(databases => this.setState({databases: databases}))
  }

  public render() {
    return <div className='hero'>
      <div className='hero__content'>
        <h1>Reality</h1>
        <p>MongoDB Editor and Real-time Aggregator</p>
        {this.state.databases.map((database)=> 
          <Link key={database._id} className='underline' to={`/db/${database._id}`}>{database.attributes.alias}<br/>{database.attributes.db_name}</Link>
        )}
      </div>
    </div>
  }
}