
import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button } from '../components/button'
import { Overlay } from '../components/overlay'

import Database from '../models/database'


interface Props extends RouteComponentProps<any> {}
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
        <ul>
        {this.state.databases.map((database)=> 
          <li key={database._id}><Link className='underline' to={`/db/${database._id}`}>{database.attributes.alias}<br/>{database.attributes.db_name}</Link></li>
        )}
        </ul>
        <Button to='/db/new' label='Connect to a Database' />
        <Overlay show={this.props.match.url === '/db/new'} back='/'>Hello</Overlay>
      </div>
    </div>
  }
}