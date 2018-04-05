
import * as React from "react"
import { MongoClient, Db, Collection } from "mongodb"

interface Props {
  url: string,
  db_name: string
}
interface State {
  collections: Collection[]
}

export class Database extends React.Component<Props, State> {

  private client : MongoClient
  private db : Db 

  constructor(props: Props) {
    super(props)
    this.state = {
      collections: []
    }
  }

  componentDidMount() {
    MongoClient.connect(this.props.url)
      .then(client => {
        this.client = client
        this.db = this.client.db(this.props.db_name)
        this.db.collections().then(collections => this.setState({collections}))
      })
  }

  componentWillUnmount() {

  }

  
  public render() {
    console.log(this.state.collections)
    return <div className="grid grid--guttered">
      <div className="col col--3of12">
        <h2>Collections</h2>
        {this.state.collections.map(collection => (
        <div key={collection.collectionName}>{collection.collectionName}</div>
        ))}
      </div>
      <div className="col col--9of12">

      </div>
    </div>
  }
}