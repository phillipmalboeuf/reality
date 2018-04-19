
import * as React from 'react'
import { Transition, animated } from 'react-spring'
import { Link } from 'react-router-dom'

interface Props {
  back: string,
  show?: boolean
}
interface State {}

export class Overlay extends React.PureComponent<Props, State> {

  public render() {
    const overlay = (styles: any): JSX.Element => {
      return <div style={styles} className={`overlay`}>
        <Link className='overlay__back' to={this.props.back} />
        <div className='overlay__container'>
          {this.props.children}
        </div>
      </div>
    }

    return <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
      {this.props.show && overlay}
    </Transition>
  }
}