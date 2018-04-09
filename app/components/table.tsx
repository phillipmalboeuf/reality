
import * as React from 'react'

interface Props {
  name: string,
  items: any[],
}
interface State {}

export class Table extends React.Component<Props, State> {


  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }
  
  public render() {
    let keys: any = {}
    this.props.items.forEach(item => Object.keys(item).forEach(key => keys[key] = typeof item[key]))
    return <div className='relative'>
      <h3>{this.props.name}</h3>
      <table>
        <tbody>
          <tr>
            {Object.keys(keys).map(key => <th key={key}>{key}</th>)}
          </tr>
          {this.props.items.map((item, index)=> <tr key={index}>
            {Object.keys(keys).map(key => <td key={key}>{item[key] !== undefined && item[key].toString()}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  }
}