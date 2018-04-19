
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
  items: any[],
  collection: Collection
}
interface State {
  updates: { [key:string]: any },
  columns: Column[]
}

export class Table extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      updates: {},
      columns: []
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return {
      updates: prevState.updates || {},
      columns: Object.entries(nextProps.items.reduce((columns, item)=> {
        Object.keys(item).forEach((key, index)=> columns[key] = {
          type: item[key].constructor.name,
          readonly: key === '_id',
          order: index
        })
        return columns
      }, {})).map(([key, column])=> ({
        ...column,
        key: key
      }))
    }
  }

  private update(_id: string, key: string, value: any) {
    // this.setState({ updates: { ...this.state.updates, [_id]: { ...(this.state.updates[_id] || {}), [key]: value } } })
  }

  private setColumns(columns: Column[]) {
    this.setState({
      columns: columns
    })
    // this.setState({
    //   columns: {
    //     ...this.state.columns,
    //     [key]: { ...this.state.columns[key], expanded: true },
    //     ...(this.props.items.reduce((columns, item)=> {
    //       let value = this.value(key, item)
    //       value && Object.keys(value).forEach((k, index)=> columns[`${key}.${k}`] = {
            // type: value[k].constructor.name,
            // order: index
    //       })
    //       return columns
    //     }, {}))
    //   }
    // })
  }

  private collapseObject(key: string) {
    // Object.keys(this.state.columns).filter(k => k.indexOf(`${key}.`) === 0).forEach(k => delete this.state.columns[k])
    // this.setState({
    //   columns: {
    //     ...this.state.columns,
    //     [key]: { ...this.state.columns[key], expanded: false }
    //   }
    // })
  }

  private save() {
    this.props.collection.bulkWrite(Object.keys(this.state.updates).map(_id => ({
      updateOne: {
        filter: { _id: new ObjectId(_id) }, update: { '$set': this.state.updates[_id] }, upsert: true 
      }
    }))).then(result => this.setState({ updates: {} }))
  }

  // private value(key: string, item: any): any {
  //   let value = item
  //   key.split('.').forEach(k => value = value !== undefined ? value[k] : undefined)
  //   return value
  // }

  public render() {
    console.log(this.state.columns)
    // let columns_list = Object.keys(this.state.columns)
    
    return <div className='relative'>
      <h3>{this.props.name}</h3>
      <Button label='Save' onClick={(e)=> this.save()} disabled={Object.keys(this.state.updates).length === 0} />
      <table>
        <tbody>
          <tr>
            {this.state.columns.map(column => <th key={column.key} className={`${column.pinned ? 'th--pinned' : ''}`}>{column.key}</th>)}
          </tr>
          
          {this.props.items.map((item)=>
          <tr key={item._id} className={this.state.updates[item._id] ? 'tr--updated' : ''}>
            <Row item={item}
              items={this.props.items}
              columns={this.state.columns}
              updates={this.state.updates[item._id]}
              update={this.update.bind(this)}
              setColumns={this.setColumns.bind(this)} />
          </tr>)}
        </tbody>
      </table>
    </div>
  }
}



