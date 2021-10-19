import React from 'react'
import { RenderResult, render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react'
import { RepositoriesList } from '..'
import { GetRepositories, QueryParamsDTO } from '@/domain/usecases/get-repositories'
import { Paginator, Repository } from '@/domain/models'
import { mockedRepositoriesPaginator } from '@/domain/tests'
import { UnavailableError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'
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
      page: 1,
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
  test('Should render proper error if GetRepositories throws UnexpectedError', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnexpectedError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    expect(screen.getByTestId('main-error').textContent).toBe(error.message)
  })
  test('Should render proper error if GetRepositories throws UnavailableError', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnavailableError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    expect(screen.getByTestId('main-error').textContent).toBe(error.message)
  })
  test('Should call GetRepositories with the proper page on pagination', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    const nextPageButton = screen.getByTestId('next-page')
    const lastPageButton = screen.getByTestId('last-page')
    const backPageButton = screen.getByTestId('back-page')
    const firstPageButton = screen.getByTestId('first-page')
    fireEvent.click(nextPageButton)
    expect(getRepositoriesSpy.callCount).toBe(2)
    expect(getRepositoriesSpy.params?.page).toBe(2)
    fireEvent.click(lastPageButton)
    expect(getRepositoriesSpy.callCount).toBe(3)
    expect(getRepositoriesSpy.params?.page).toBe(20)
    fireEvent.click(backPageButton)
    expect(getRepositoriesSpy.callCount).toBe(4)
    expect(getRepositoriesSpy.params?.page).toBe(19)
    fireEvent.click(firstPageButton)
    expect(getRepositoriesSpy.callCount).toBe(5)
    expect(getRepositoriesSpy.params?.page).toBe(1)
  })
  test('Should call GetRepositories with the proper rowsPerpage values when changing the option', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    const perPageSelector = dataTable.querySelector('select.MuiTablePagination-select') as HTMLSelectElement
    fireEvent.change(perPageSelector, { target: { value: '25' } })
    expect(getRepositoriesSpy.params?.per_page).toBe(25)
    expect(getRepositoriesSpy.callCount).toBe(2)
  })
  test('Should call GetRepositories with the proper params on submit', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    const inputValue = faker.random.word()
    const inputWrapper = screen.getByTestId('name-input')
    const nameInput = inputWrapper.querySelector('input.MuiInput-input') as HTMLInputElement
    fireEvent.input(nameInput, { target: { value: inputValue } })
    fireEvent.click(screen.getByTestId('submit-button'))
    expect(getRepositoriesSpy.params).toEqual({
      name: inputValue,
      page: 1,
      per_page: 5
    })
    expect(getRepositoriesSpy.callCount).toBe(2)
  })
  test('Should disable submit button while getting', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    const submitButton = screen.getByTestId('submit-button')
    expect((submitButton as HTMLButtonElement).disabled).toBeTruthy()
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    expect((submitButton as HTMLButtonElement).disabled).toBeFalsy()
    const inputValue = faker.random.word()
    const inputWrapper = screen.getByTestId('name-input')
    const nameInput = inputWrapper.querySelector('input.MuiInput-input') as HTMLInputElement
    fireEvent.input(nameInput, { target: { value: inputValue } })
    fireEvent.click(submitButton)
    expect((submitButton as HTMLButtonElement).disabled).toBeTruthy()
  })
  test('Should render proper error message if GetRepositories throws on submit', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnexpectedError()
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    const submitButton = screen.getByTestId('submit-button')
    const inputValue = faker.random.word()
    const inputWrapper = screen.getByTestId('name-input')
    const nameInput = inputWrapper.querySelector('input.MuiInput-input') as HTMLInputElement
    fireEvent.input(nameInput, { target: { value: inputValue } })
    fireEvent.click(submitButton)
    await waitFor(() => dataTable)
    expect(screen.getByTestId('main-error').textContent).toBe(error.message)
  })
  test('Should render the query results on submit', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    const secondResponse = mockedRepositoriesPaginator()
    jest.spyOn(getRepositoriesSpy, 'get').mockResolvedValueOnce(secondResponse)
    const inputValue = faker.random.word()
    const inputWrapper = screen.getByTestId('name-input')
    const nameInput = inputWrapper.querySelector('input.MuiInput-input') as HTMLInputElement
    fireEvent.input(nameInput, { target: { value: inputValue } })
    fireEvent.click(screen.getByTestId('submit-button'))
    await waitFor(() => dataTable)
    expect(screen.getByText(secondResponse.items[0].description)).toBeTruthy()
    expect(screen.getByTestId('row-0')).toBeTruthy()
  })
})
