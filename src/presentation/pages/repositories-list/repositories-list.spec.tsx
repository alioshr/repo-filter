import React from 'react'
import { RenderResult, render, screen, waitFor, cleanup } from '@testing-library/react'
import { RepositoriesList } from '..'
import { GetRepositories, QueryParamsDTO } from '@/domain/usecases/get-repositories'
import { Paginator, Repository } from '@/domain/models'
import { mockedRepositoriesPaginator } from '@/domain/tests'
class GetRepositoriesSpy implements GetRepositories {
  callCount = 0
  params: QueryParamsDTO | null = null
  response: Paginator<Repository[]> | Error = {
    incomplete_results: false,
    total_count: 1,
    items: []
  }

  async get (params: QueryParamsDTO): Promise<Paginator<Repository[]>> {
    this.params = params
    this.callCount = this.callCount + 1
    return this.response as any
  }
}

type SutTypes = {
  sut: RenderResult
  getRepositoriesSpy: GetRepositoriesSpy
}

const makeSut = (getRepositoriesSpy = new GetRepositoriesSpy()): SutTypes => {
  const sut = render(
    <RepositoriesList getRepositories={getRepositoriesSpy}/>
  )
  return { sut, getRepositoriesSpy }
}

describe('RepositoriesList', () => {
  afterEach(cleanup)

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
      page: 0,
      per_page: 5
    })
  })
  test('Should load repositories on success', async () => {
    const response = mockedRepositoriesPaginator()
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    expect(dataTable.querySelectorAll('tr.skeleton')).toHaveLength(0)
    expect(screen.queryByTestId('main-error')).toBeNull()
    expect(screen.getByText(response.items[0].description)).toBeTruthy()
    expect(screen.getByTestId('row-0')).toBeTruthy()
  })
})
