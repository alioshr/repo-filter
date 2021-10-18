import React from 'react'
import { RenderResult, render, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { RepositoriesList } from '..'
import { createMemoryHistory } from 'history'

type SutTypes = {
  sut: RenderResult
}

const history = createMemoryHistory({ initialEntries: ['/'] })
const makeSut = (): SutTypes => {
  const sut = render(
    <Router history={history}>
    <RepositoriesList />
    </Router>
  )
  return { sut }
}

describe('RepositoriesList', () => {
  test('Should present 5 skeleton rows on start', async () => {
    makeSut()
    const dataTable = screen.getByTestId('data-table')

    expect(dataTable.querySelectorAll('tr.skeleton')).toHaveLength(5)
    expect(dataTable.querySelectorAll('tr.dataRow')).toHaveLength(0)
    expect(screen.queryByTestId('main-error')).toBeNull()
  })
})
