import * as React from 'react'
import { ObjectId } from 'mongodb'
import { Button } from './button'
import { Column } from './table'


interface Props {
  item: any,
  items: any[],
  columns: Column[],
  updates?: { [key:string]: any },
  headers?: boolean,
  update?: Function,
  setColumns?: Function
}

export const Row: React.SFC<Props> = (props) => {
  const expandObject = (key: string)=> {
    props.setColumns(props.columns.map(column => column.key === key ? {
      ...column,
      expanded: true,
      columns: Object.entries(column.value).map(([k, value], index)=> ({
        key: `${key}.${k}`,
        type: value.constructor.name,
        order: index
      }))
    } : column))
  }

  const collapseObject = (key: string)=> {

  }

  const value = (key: string, item: any)=> {
    console.log(key)
    let value = item
    key.split('.').forEach(k => value = value !== undefined ? value[k] : undefined)
    return value
  }

  props.columns.forEach(column => column.value = value(column.key, props.item))

  return <React.Fragment>
    {props.columns.map((column, index)=> {
      return <React.Fragment key={column.key}>
        <td key={column.key} className={`${column.pinned ? 'td--pinned' : ''}${props.updates && props.updates[column.key] !== undefined ? ' td--updated' : ''}`}>
          {!column.readonly
            ? ({
              'String': <input type='text'
                onInput={(e)=> props.update(props.item._id, column.key, e.currentTarget.value)}
                defaultValue={column.value} />,
              'Boolean': <>
                <input id={`${props.item._id}_${column.key}`} type='checkbox'
                  onClick={(e)=> props.update(props.item._id, column.key, e.currentTarget.checked)}
                  defaultChecked={column.value || false} />
                <label htmlFor={`${props.item._id}_${column.key}`}>{column.key}</label>
                </>,
              'Date': <input type='text'
                onInput={(e)=> props.update(props.item._id, column.key, new Date(e.currentTarget.value))}
                defaultValue={column.value} />,
              'ObjectID': <input type='text'
                onInput={(e)=> props.update(props.item._id, column.key, new ObjectId(e.currentTarget.value))}
                defaultValue={column.value} />,
              'Object': <Button
                onClick={(e)=> column.expanded ? collapseObject(column.key) : expandObject(column.key)}
                label={`{ ${column.expanded ? 'Collapse' : 'Expand'} }`} />,
              'Array': <Button
                onClick={(e)=> console.log(column.key)}
                label='[ Expand ]' />
            } as any)[column.type]
            : <small>{column.value.toString()}</small>}
        </td>
        {column.columns && <Row item={props.item} columns={column.columns} items={props.items} />}
      </React.Fragment>
    })}
  </React.Fragment>
}