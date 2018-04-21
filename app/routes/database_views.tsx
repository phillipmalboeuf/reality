
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { MongoClient, Db, Collection } from 'mongodb'

import { Table } from '../components/table'
import { Button } from '../components/button'

import Database from '../models/database'


interface Props extends RouteComponentProps<any> {}
export interface State {
  database: Database,
  collections?: Collection[],
  collection?: string,
  collection_items?: any[]
}

export class DatabaseViews extends React.Component<Props, State> {

  private client : MongoClient
  private db : Db

  constructor(props: Props) {
    super(props)
    this.state = {
      database: null,
      collections: []
    }
  }

  componentDidMount() {
    (new Database({_id: this.props.match.params._id})).fetch().then(database => {
      this.setState({ database })

      MongoClient.connect(database.attributes.url)
        .then(client => {
          this.client = client
          this.db = this.client.db(database.attributes.db_name)
          this.db.collections().then(collections => this.setState({ collections }))
          if (this.props.match.params.collection) { this.setCollection() }
        })
    })
    
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.match.params.collection && (!prevProps.match || prevProps.match.params.collection !== this.props.match.params.collection)) { this.setCollection() }
  }

  componentWillUnmount() {

  }

  public setCollection(query={}) {
    return this.db.collection(this.props.match.params.collection).find(query).toArray().then(items => {
      this.setState({collection: this.props.match.params.collection, collection_items: items})
    })
  }
  
  public render() {
    return <div className="grid grid--grow-last grid--column full-height">
      <div className="tab-bar padded padded--flat_bottom">
        <Button to='/' label='Back' />
        {this.state.collections.map(collection => (
          <React.Fragment key={collection.collectionName}>
            <Link className={`tab ${this.state.collection && this.state.collection === collection.collectionName ? 'tab--active' : ''}`} to={`/db/${this.props.match.params._id}/${collection.collectionName}`} key={collection.collectionName}>{collection.collectionName}</Link>
          </React.Fragment>
        ))}
      </div>
      <div className="padded grow scroll">
        {this.state.collection && <Table name={this.state.collection} items={this.state.collection_items} collection={this.db.collection(this.props.match.params.collection)} />}
      </div>
    </div>
  }
}
