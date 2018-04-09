import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Connect } from './routes/connect'
import { Database } from './routes/database'

export const Routes = ()=> <Switch>
  <Route exact path='/' component={Connect} />
  <Route exact path='/db/:index' component={Database} />
  <Route exact path='/db/:index/:collection' component={Database} />
</Switch>