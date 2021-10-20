import Router from '@/presentation/router/router'
import React from 'react'
import ReactDOM from 'react-dom'
import { makeRepositoriesList } from '@/main/factories/pages/repositories-list-factory'

ReactDOM.render(
  <Router makeRepositoriesList={makeRepositoriesList}/>,
  document.getElementById('main')
)
