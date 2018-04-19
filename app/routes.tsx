import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Connect } from './routes/connect'
import { DatabaseViews } from './routes/database_views'

export const Routes = ()=> <Switch>
  <Route exact path='/' component={Connect} />
  <Route exact path='/db/new' component={Connect} />
  <Route exact path='/db/:_id' component={DatabaseViews} />
  <Route exact path='/db/:_id/:collection' component={DatabaseViews} />
</Switch>