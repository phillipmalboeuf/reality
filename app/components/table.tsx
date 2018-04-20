
import * as React from 'react'
import { Collection, ObjectId } from 'mongodb'

import { Button } from './button'
import { Row } from './row'


export interface Column {
  key: string,
  type: string,
  value?: any,
  pinned?: boolean,
  readonly?: boolean,
  hidden?: boolean,
  expanded?: boolean,
  columns?: Column[]
}

interface Props {
  name: string,
  items: object[],
  collection: Collection
}
interface State {
  updates: { [key:string]: any },
  columns: { [key:string]: Column }
  peaking?: object
}

export class Table extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      updates: {},
      columns: {}
      peaking: null
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return {
      updates: prevState.updates || {},
      columns: nextProps.items.reduce((columns, item)=> {
        Object.keys(item).forEach((key, index)=> columns[key] = {
          type: item[key].constructor.name,
          readonly: key === '_id',
          order: index
        })
        return columns
      }, {})
    }
  }

  private update(_id: string, key: string, value: any) {
    this.setState({ updates: { ...this.state.updates, [_id]: { ...(this.state.updates[_id] || {}), [key]: value } } })
  }


  private expandObject(key: string) {
    this.setState({
      columns: {
        ...this.state.columns,
        [key]: { ...this.state.columns[key], expanded: true },
        ...(this.props.items.reduce((columns, item)=> {
          let value = this.value(key, item)
          value && Object.keys(value).forEach((k, index)=> columns[`${key}.${k}`] = {
            type: value[k].constructor.name,
            order: index
          })
          return columns
        }, {}))
      }
    })
  }

  private collapseObject(key: string) {
    Object.keys(this.state.columns).filter(k => k.indexOf(`${key}.`) === 0).forEach(k => delete this.state.columns[k])
    this.setState({
      columns: {
        ...this.state.columns,
        [key]: { ...this.state.columns[key], expanded: false }
      }
    })
  }

  public value(key: string, item: any) {
    let value = item
    key.split('.').forEach(k => value = value !== undefined ? value[k] : undefined)
    return value
  }

  private save() {
    this.props.collection.bulkWrite(Object.keys(this.state.updates).map(_id => ({
      updateOne: {
        filter: { _id: new ObjectId(_id) }, update: { '$set': this.state.updates[_id] }, upsert: true 
      }
    }))).then(result => this.setState({ updates: {} }))
  }

  private peak(key: string, _id: string) {
    if (!key) {
      this.setState({ peaking: null });
    }
    if (key === '_id') {
      return this.setState({ peaking: this.props.items.find((item) => item._id == _id) })
    }
  }

  public render() {
    let columns = Object.entries(this.state.columns).map(([key, column])=> ({
      ...column,
      key: key
    }))
    columns.reverse()
    columns.forEach(column => {
      if (column.expanded) {
        column.columns = columns.filter(c => c.key.indexOf(`${column.key}.`) === 0)
        column.columns.reverse()
        columns = columns.filter(c => c.key.indexOf(`${column.key}.`) !== 0)
      }
    })
    columns.reverse()

    
    return <div className='relative'>
      <Button label='Save' onClick={(e)=> this.save()} disabled={Object.keys(this.state.updates).length === 0} />
      <table>
        <tbody>
          <tr>
            <Row headers
              columns={columns} />
          </tr>
    
          {this.props.items.map((item)=>
          <tr key={item._id} className={this.state.updates[item._id] ? 'tr--updated' : ''}>
            <Row item={item}
              columns={columns}
              peaking={this.state.peaking}
              peak={this.peak.bind(this)}
              updates={this.state.updates[item._id]}
              update={this.update.bind(this)}
              expandObject={this.expandObject.bind(this)}
              collapseObject={this.collapseObject.bind(this)} />
          </tr>)}
        </tbody>
      </table>
    </div>
  }
}



