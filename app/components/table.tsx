
import * as React from 'react'

import { Button } from './button'
import { Collection, ObjectId } from 'mongodb'

interface Column {
  type: string,
  order?: number,
  pinned?: boolean,
  readonly?: boolean,
  hidden?: boolean
}

interface Props {
  name: string,
  items: any[],
  collection: Collection
}
interface State {
  updates: any,
  columns: { [key:string]: Column }
}

export class Table extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      updates: {},
      columns: props.items.reduce((columns, item)=> {
        Object.keys(item).forEach(key => columns[key] = {
          type: item[key].constructor.name,
          pinned: key === '_id',
          readonly: key === '_id',
        })
        return columns
      }, {})
    }

    console.log(this.state.columns)
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
    return <div className='relative'>
      <h3>{this.props.name}</h3>
      <Button label='Save' onClick={(e)=> this.save()} disabled={Object.keys(this.state.updates).length === 0} />
      <table>
        <tbody>
          <tr>
            {Object.keys(this.state.columns).map(key => <th key={key} className={`${this.state.columns[key].pinned ? 'th--pinned' : ''}`}>{key}</th>)}
          </tr>
          {this.props.items.map((item)=> <tr key={item._id} className={this.state.updates[item._id] ? 'tr--updated' : ''}>
            {Object.keys(this.state.columns).map(key =>
            <td key={key} className={`${this.state.columns[key].pinned ? 'td--pinned' : ''}${this.state.updates[item._id] && this.state.updates[item._id][key] !== undefined ? ' td--updated' : ''}`}>
              {!this.state.columns[key].readonly
                ? ({
                  'String': <input type='text' onInput={(e)=> this.update(item._id, key, e.currentTarget.value)} defaultValue={item[key] !== undefined ? item[key] : undefined} />,
                  'Boolean': <><input id={`${item._id}_${key}`} type='checkbox' onClick={(e)=> this.update(item._id, key, e.currentTarget.checked)} defaultChecked={item[key] || false} /><label htmlFor={`${item._id}_${key}`}>{key}</label></>,
                  'Date': <input type='text' onInput={(e)=> this.update(item._id, key, new Date(e.currentTarget.value))} defaultValue={item[key] !== undefined ? item[key] : undefined} />
                } as any)[this.state.columns[key].type]
                : <small>{item[key] !== undefined ? item[key].toString() : undefined}</small>}
            </td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  }
}



