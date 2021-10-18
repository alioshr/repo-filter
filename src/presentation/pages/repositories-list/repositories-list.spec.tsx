import React from 'react'
import { RenderResult, render, screen, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { RepositoriesList } from '..'
import { createMemoryHistory } from 'history'
import { GetRepositories, QueryParamsDTO } from '@/domain/usecases/get-repositories'
import { Paginator, Repository } from '@/domain/models'
class GetRepositoriesSpy implements GetRepositories {
  callCount = 0
  params: QueryParamsDTO | null = null
  response: Paginator<Repository[]> = {
    incomplete_results: false,
    total_count: 1,
    items: []
  }

  async get (params: QueryParamsDTO): Promise<Paginator<Repository[]>> {
    this.params = params
    this.callCount = this.callCount + 1
    return this.response
  }
}

type SutTypes = {
  sut: RenderResult
  getRepositoriesSpy: GetRepositoriesSpy
}

const history = createMemoryHistory({ initialEntries: ['/'] })
const makeSut = (): SutTypes => {
  const getRepositoriesSpy = new GetRepositoriesSpy()
  const sut = render(
    <Router history={history}>
    <RepositoriesList getRepositories={getRepositoriesSpy}/>
    </Router>
  )
  return { sut, getRepositoriesSpy }
}

describe('RepositoriesList', () => {
  test('Should present 5 skeleton rows on start', async () => {
    makeSut()
    const dataTable = screen.getByTestId('data-table')

    expect(dataTable.querySelectorAll('tr.skeleton')).toHaveLength(5)
    expect(dataTable.querySelectorAll('tr.dataRow')).toHaveLength(0)
    expect(screen.queryByTestId('main-error')).toBeNull()
  })
  test('Should call GetRepositories once on start with the correct params', async () => {
    const { getRepositoriesSpy } = makeSut()
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    expect(getRepositoriesSpy.callCount).toBe(1)
    expect(getRepositoriesSpy.params).toEqual({
      page: 1,
      per_page: 5
    })
  })
})
