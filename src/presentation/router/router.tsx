import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { RepositoriesList } from '../pages'
import '@/presentation/styles/_global.scss'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={RepositoriesList} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
