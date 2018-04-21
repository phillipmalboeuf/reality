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
  setColumns?: Function,
  peak: Function,
  peaking?: object
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
          ? <td
            onMouseEnter={column.type === 'ObjectID' ? () => this.props.peak(column.key, this.props.item[column.key]) : null}
            onMouseLeave={column.type === 'ObjectID' ? () => this.props.peak() : null}
            key={column.key} 
            className={`${column.pinned ? 'td--pinned' : ''}${this.props.updates && this.props.updates[column.key] !== undefined ? ' td--updated' : ''}`}>
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
              : ({
                'ObjectID': this.props.peaking && this.props.peaking._id == column.value 
                  ? <div
                  className="absolute absolute--top-left"
                  style={{ zIndex: 1000 }}>
                      <div className="card">
                        <div className="normal_bottom">
                          <div className="pill">{column.value.toString()}</div>
                        </div>
                          {Object.keys(this.props.item).map(k => <p className="no-wrap" key={k}>{k}: {this.value(k, this.props.item).toString()}</p>)}
                      </div>
                    </div>
                  : <div
                    className="pill">
                    {`${column.value.toString().substring(0, 5)}...`}
                  </div>,
              } as any)[column.type] || <small>{column.value.toString()}</small>}
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
