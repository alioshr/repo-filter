import React from 'react'
import {
  RenderResult,
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent
} from '@testing-library/react'
import { RepositoriesList } from '..'
import { mockedRepositoriesPaginator } from '@/domain/tests'
import { UnavailableError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'
import { ValidationSpy } from '@/presentation/test/validator-spy'
import { GetRepositoriesSpy } from '@/presentation/test'
import { Paginator } from '@/domain/models'
import { NoContentError } from '@/validation/errors'

const ERROR_MESSAGE = faker.random.word()

const makeValidSubmit = (value: string): void => {
  const inputWrapper = screen.getByTestId('name-input')
  const nameInput = inputWrapper.querySelector(
    'input.MuiInput-input'
  ) as HTMLInputElement
  fireEvent.input(nameInput, { target: { value: value } })
  fireEvent.click(screen.getByTestId('submit-button'))
}

type SutTypes = {
  sut: RenderResult
  getRepositoriesSpy: GetRepositoriesSpy
  validatorSpy: ValidationSpy
}

const makeSut = (
  getRepositoriesSpy = new GetRepositoriesSpy(),
  errorMessage?: string
): SutTypes => {
  const validatorSpy = new ValidationSpy()
  validatorSpy.errorMessage = errorMessage ?? null
  const sut = render(
    <RepositoriesList
      getRepositories={getRepositoriesSpy}
      validator={validatorSpy}
    />
  )
  return { sut, getRepositoriesSpy, validatorSpy }
}

describe('RepositoriesList', () => {
  afterEach(cleanup)
  test('Should start with the correct state and data', () => {
    makeSut(undefined, ERROR_MESSAGE)
    const submitButton = screen.getByTestId('submit-button')
    expect((submitButton as HTMLButtonElement).disabled).toBeTruthy()
    expect(screen.getByTestId('main-error').textContent).toBe('try me out')
    const dataTable = screen.getByTestId('data-table')
    expect(dataTable.querySelectorAll('tr.skeleton')).toHaveLength(0)
    expect(dataTable.querySelectorAll('tr.dataRow')).toHaveLength(0)
  })
  test('Should call GetRepositories with the proper params on submit', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    const inputValue = faker.random.word()
    makeValidSubmit(inputValue)
    expect(getRepositoriesSpy.params).toEqual({
      name: inputValue,
      page: 1,
      per_page: 5
    })
    expect(getRepositoriesSpy.callCount).toBe(1)
  })
  test('Should prevent form submit with invalid name', () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    makeSut(getRepositoriesSpy, ERROR_MESSAGE)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(getRepositoriesSpy.callCount).toBe(0)
  })
  test('Should have an error title if name validation fails', async () => {
    makeSut(undefined, ERROR_MESSAGE)
    const inputWrapper = screen.getByTestId('name-input')
    expect(inputWrapper.title).toBe(ERROR_MESSAGE)
  })
  test('Should disable submit button while getting', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    const submitButton = screen.getByTestId('submit-button')
    makeValidSubmit(faker.random.word())
    expect((submitButton as HTMLButtonElement).disabled).toBeTruthy()
  })
  test('Should render proper error message if GetRepositories throws on submit', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnexpectedError()
    makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    makeValidSubmit(faker.random.word())
    await waitFor(() => dataTable)
    expect(screen.getByTestId('main-error').textContent).toBe(error.message)
  })
  test('Should present a no content error if GetRepositories return no data', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const emptyData: Paginator<[]> = {
      incomplete_results: false,
      total_count: 0,
      items: []
    }
    const { validatorSpy } = makeSut(getRepositoriesSpy)
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    jest.spyOn(getRepositoriesSpy, 'get').mockResolvedValueOnce(emptyData)
    makeValidSubmit(faker.random.word())
    jest.spyOn(validatorSpy, 'validate').mockImplementationOnce(() => new NoContentError().message)
    await waitFor(() => dataTable)
    expect(screen.getByTestId('main-error').textContent).toBe(new NoContentError().message)
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
    makeValidSubmit(faker.random.word())
    await waitFor(() => dataTable)
    expect(screen.getByText(secondResponse.items[0].description)).toBeTruthy()
    expect(screen.getByTestId('row-0')).toBeTruthy()
  })
  test('Should present 5 skeleton rows while loading', async () => {
    makeSut()
    makeValidSubmit(faker.random.word())
    const dataTable = screen.getByTestId('data-table')
    expect(dataTable.querySelectorAll('tr.skeleton')).toHaveLength(5)
    expect(dataTable.querySelectorAll('tr.dataRow')).toHaveLength(0)
    expect(screen.queryByTestId('main-error')).toBeNull()
  })
  test('Should load repositories on success', async () => {
    const response = mockedRepositoriesPaginator()
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    makeValidSubmit(faker.random.word())
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
    makeValidSubmit(faker.random.word())
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    expect(screen.getByTestId('main-error').textContent).toBe(error.message)
  })
  test('Should render proper error if GetRepositories throws UnavailableError', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnavailableError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    makeSut(getRepositoriesSpy)
    makeValidSubmit(faker.random.word())
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
    makeValidSubmit(faker.random.word())
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
  test('Should present error if pagination fails', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    makeValidSubmit(faker.random.word())
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    const error = new UnavailableError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    const nextPageButton = screen.getByTestId('next-page')
    fireEvent.click(nextPageButton)
    await waitFor(() => dataTable)
    expect(screen.getByTestId('main-error').textContent).toBe(error.message)
  })
  test('Should present error if rows per page selection fails', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    makeValidSubmit(faker.random.word())
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    const error = new UnavailableError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    const perPageSelector = dataTable.querySelector(
      'select.MuiTablePagination-select'
    ) as HTMLSelectElement
    fireEvent.change(perPageSelector, { target: { value: '25' } })
    await waitFor(() => dataTable)
    expect(screen.getByTestId('main-error').textContent).toBe(error.message)
  })
  test('Should call GetRepositories with the proper rowsPerpage values when changing the option', async () => {
    const response = mockedRepositoriesPaginator()
    response.total_count = 100
    const getRepositoriesSpy = new GetRepositoriesSpy()
    getRepositoriesSpy.response = response
    makeSut(getRepositoriesSpy)
    makeValidSubmit(faker.random.word())
    const dataTable = screen.getByTestId('data-table')
    await waitFor(() => dataTable)
    const perPageSelector = dataTable.querySelector(
      'select.MuiTablePagination-select'
    ) as HTMLSelectElement
    fireEvent.change(perPageSelector, { target: { value: '25' } })
    expect(getRepositoriesSpy.params?.per_page).toBe(25)
    expect(getRepositoriesSpy.callCount).toBe(2)
  })
})
