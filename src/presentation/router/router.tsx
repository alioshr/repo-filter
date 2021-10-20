import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import '@/presentation/styles/_global.scss'

type Props = {
  makeRepositoriesList: React.FC
}

const Router: React.FC<Props> = ({ makeRepositoriesList }) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={makeRepositoriesList} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
