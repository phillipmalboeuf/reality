import * as React from 'react'
import { ObjectId } from 'mongodb'
import { Button } from './button'
import { Column } from './table'


interface Props {
  item?: any,
  columns: Column[],
  updates?: { [key:string]: any },
  headers?: boolean,
  update?: Function,
  expandObject?: Function,
  collapseObject?: Function
}
interface State {}


export class Row extends React.Component<Props, State> {

  public value(key: string, item: any) {
    let value = item
    key.split('.').forEach(k => value = value !== undefined ? value[k] : undefined)
    return value
  }

  public render(): JSX.Element[] {
    if (!this.props.headers) {
      this.props.columns.forEach(column => column.value = this.value(column.key, this.props.item))
    }

    return this.props.columns.map((column, index)=> {
        return <React.Fragment key={column.key}>
          {!this.props.headers
          ? <td key={column.key} className={`${column.pinned ? 'td--pinned' : ''}${this.props.updates && this.props.updates[column.key] !== undefined ? ' td--updated' : ''}`}>
            {!column.readonly
              ? ({
                'String': <input type='text'
                  onInput={(e)=> this.props.update(this.props.item._id, column.key, e.currentTarget.value)}
                  defaultValue={column.value} />,
                'Boolean': <>
                  <input id={`${this.props.item._id}_${column.key}`} type='checkbox'
                    onClick={(e)=> this.props.update(this.props.item._id, column.key, e.currentTarget.checked)}
                    defaultChecked={column.value || false} />
                  <label htmlFor={`${this.props.item._id}_${column.key}`}>{column.key}</label>
                  </>,
                'Date': <input type='text'
                  onInput={(e)=> this.props.update(this.props.item._id, column.key, new Date(e.currentTarget.value))}
                  defaultValue={column.value} />,
                'ObjectID': <input type='text'
                  onInput={(e)=> this.props.update(this.props.item._id, column.key, new ObjectId(e.currentTarget.value))}
                  defaultValue={column.value} />,
                'Object': <Button
                  onClick={(e)=> column.expanded ? this.props.collapseObject(column.key) : this.props.expandObject(column.key)}
                  label={`{ ${column.expanded ? 'Collapse' : 'Expand'} }`} />,
                'Array': <Button
                  onClick={(e)=> console.log(column.key)}
                  label='[ Expand ]' />
              } as any)[column.type]
              : <small>{column.value.toString()}</small>}
          </td>
          : <th key={column.key} className={`${column.pinned ? 'th--pinned' : ''}`}>{column.key}</th>
          }
          {column.columns &&
            <Row item={this.props.item}
              columns={column.columns}
              headers={this.props.headers}
              update={this.props.update}
              expandObject={this.props.expandObject}
              collapseObject={this.props.collapseObject} />}
        </React.Fragment>
      })
  }
}