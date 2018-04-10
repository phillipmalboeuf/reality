
import * as React from 'react'

import { Button } from './button'
import { Collection, ObjectId } from 'mongodb'

interface Props {
  name: string,
  items: any[],
  collection: Collection
}
interface State {
  updates: any
}

export class Table extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      updates: {}
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  private update(_id: string, key: string, value: any) {
    this.setState({ updates: { ...this.state.updates, [_id]: { ...(this.state.updates[_id] || {}), [key]: value } } })
  }

  private save() {
    this.props.collection.bulkWrite(Object.keys(this.state.updates).map(_id => ({
      updateOne: {
        filter: { _id: new ObjectId(_id) }, update: { '$set': this.state.updates[_id] }, upsert: true 
      }
    }))).then(result => this.setState({ updates: {} }))
  }
  
  public render() {
    let keys: any = {}
    this.props.items.forEach(item => Object.keys(item).forEach(key => keys[key] = typeof item[key]))
    return <div className='relative'>
      <h3>{this.props.name}</h3>
      <Button label='Save' onClick={(e)=> this.save()} disabled={Object.keys(this.state.updates).length === 0} />
      <table>
        <tbody>
          <tr>
            {Object.keys(keys).map(key => <th key={key}>{key}</th>)}
          </tr>
          {this.props.items.map((item)=> <tr key={item._id} className={this.state.updates[item._id] ? 'tr--updated' : ''}>
            {Object.keys(keys).map(key => <td key={key} className={this.state.updates[item._id] && this.state.updates[item._id][key] !== undefined ? 'td--updated' : ''}><input type='text' onInput={(e)=> this.update(item._id, key, e.currentTarget.value)} defaultValue={item[key] !== undefined && item[key].toString()} /></td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  }
}