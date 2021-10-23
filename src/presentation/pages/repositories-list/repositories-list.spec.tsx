import React from 'react'
import {
  RenderResult,
  render,
  screen,
  cleanup,
  fireEvent
} from '@testing-library/react'
import { RepositoriesList } from '..'
import { mockedRepositoriesPaginator } from '@/domain/tests'
import { UnavailableError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'
import { ValidationSpy } from '@/presentation/test/validator-spy'
import { GetRepositoriesSpy } from '@/presentation/test'
import { Paginator, Repository } from '@/domain/models'
import { NoContentError } from '@/validation/errors'
import * as Helper from '@/presentation/test/form-helper'

const ERROR_MESSAGE = faker.random.word()

const makeValidSubmit = (value: string = faker.random.word()): void => {
  Helper.populateField('name-input', value)
  Helper.clickElement('submit-button')
}

const testGridElementsLength = (skeletonLength: number, mainDataLength: number): void => {
  const dataTable = screen.getByTestId('data-table')
  expect(dataTable.querySelectorAll('tr.skeleton')).toHaveLength(skeletonLength)
  expect(dataTable.querySelectorAll('tr.dataRow')).toHaveLength(mainDataLength)
}

const renderScreen = (
  getRepositoriesSpy: GetRepositoriesSpy = new GetRepositoriesSpy(),
  response: Paginator<Repository[] | []> = mockedRepositoriesPaginator()
): void => {
  response.total_count = 100
  getRepositoriesSpy.response = response
  makeSut(getRepositoriesSpy)
}

const populatePaginatorSelect = (value: string): void => {
  const dataTable = screen.getByTestId('data-table')
  const perPageSelector = dataTable.querySelector(
    'select.MuiTablePagination-select'
  ) as HTMLSelectElement
  fireEvent.change(perPageSelector, { target: { value } })
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
    Helper.testButtonDisabled('submit-button', true)
    Helper.testFieldTextContent('main-error', 'try me out')
    testGridElementsLength(0, 0)
  })
  test('Should call GetRepositories with the proper params on submit', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    renderScreen(getRepositoriesSpy)
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
    renderScreen()
    makeValidSubmit()
    Helper.testButtonDisabled('submit-button', true)
  })
  test('Should render proper error message if GetRepositories throws on submit', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnexpectedError()
    makeSut(getRepositoriesSpy)
    await Helper.waitForElement('data-table')
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    Helper.testFieldTextContent('main-error', error.message)
  })
  test('Should present a no content error if GetRepositories return no data', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const emptyData: Paginator<[]> = {
      incomplete_results: false,
      total_count: 0,
      items: []
    }
    const { validatorSpy } = makeSut(getRepositoriesSpy)
    await Helper.waitForElement('data-table')
    jest.spyOn(getRepositoriesSpy, 'get').mockResolvedValueOnce(emptyData)
    makeValidSubmit()
    jest
      .spyOn(validatorSpy, 'validate')
      .mockImplementationOnce(() => new NoContentError().message)
    await Helper.waitForElement('data-table')
    Helper.testFieldTextContent('main-error', new NoContentError().message)
  })
  test('Should render the query results on submit', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    renderScreen(getRepositoriesSpy)
    await Helper.waitForElement('data-table')
    const secondResponse = mockedRepositoriesPaginator()
    jest.spyOn(getRepositoriesSpy, 'get').mockResolvedValueOnce(secondResponse)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    expect(screen.getByText(secondResponse.items[0].description)).toBeTruthy()
    expect(screen.getByTestId('row-0')).toBeTruthy()
  })
  test('Should present 5 skeleton rows while loading', async () => {
    makeSut()
    makeValidSubmit()
    testGridElementsLength(5, 0)
    expect(screen.queryByTestId('main-error')).toBeNull()
  })
  test('Should load repositories on success', async () => {
    const response = mockedRepositoriesPaginator()
    renderScreen(undefined, response)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    testGridElementsLength(0, 1)
    expect(screen.queryByTestId('main-error')).toBeNull()
    expect(screen.getByText(response.items[0].description)).toBeTruthy()
    expect(screen.getByTestId('row-0')).toBeTruthy()
  })
  test('Should render proper error if GetRepositories throws UnexpectedError', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnexpectedError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    makeSut(getRepositoriesSpy)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    Helper.testFieldTextContent('main-error', error.message)
  })
  test('Should hide the pagination toolbar in case of any error', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnexpectedError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    makeSut(getRepositoriesSpy)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    Helper.testFieldTextContent('main-error', error.message)
    const dataTable = screen.getByTestId('data-table')
    const paginationWrapper = dataTable.querySelector('td.MuiTablePagination-root')
    expect(paginationWrapper).toBeNull()
  })
  test('Should render proper error if GetRepositories throws UnavailableError', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    const error = new UnavailableError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    makeSut(getRepositoriesSpy)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    Helper.testFieldTextContent('main-error', error.message)
  })
  test('Should call GetRepositories with the proper page on pagination', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    renderScreen(getRepositoriesSpy)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    Helper.clickElement('next-page')
    expect(getRepositoriesSpy.callCount).toBe(2)
    expect(getRepositoriesSpy.params?.page).toBe(2)
    Helper.clickElement('last-page')
    expect(getRepositoriesSpy.callCount).toBe(3)
    expect(getRepositoriesSpy.params?.page).toBe(20)
    Helper.clickElement('back-page')
    expect(getRepositoriesSpy.callCount).toBe(4)
    expect(getRepositoriesSpy.params?.page).toBe(19)
    Helper.clickElement('first-page')
    expect(getRepositoriesSpy.callCount).toBe(5)
    expect(getRepositoriesSpy.params?.page).toBe(1)
  })
  test('Should persist pagination with input if user wipes input and does not re-submit', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    renderScreen(getRepositoriesSpy)
    const firstInputValue = faker.random.word()
    makeValidSubmit(firstInputValue)
    await Helper.waitForElement('data-table')
    Helper.populateField('name-input', '')
    Helper.clickElement('next-page')
    expect(getRepositoriesSpy.params).toEqual({
      name: firstInputValue,
      page: 2,
      per_page: 5
    })
  })
  test('Should present error if pagination fails', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    renderScreen(getRepositoriesSpy)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    const error = new UnavailableError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    Helper.clickElement('next-page')
    await Helper.waitForElement('data-table')
    Helper.testFieldTextContent('main-error', error.message)
  })
  test('Should present error if rows per page selection fails', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    renderScreen(getRepositoriesSpy)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    await Helper.waitForElement('data-table')
    const error = new UnavailableError()
    jest.spyOn(getRepositoriesSpy, 'get').mockRejectedValueOnce(error)
    populatePaginatorSelect('25')
    await Helper.waitForElement('data-table')
    Helper.testFieldTextContent('main-error', error.message)
  })
  test('Should call GetRepositories with the proper rowsPerpage values when changing the option', async () => {
    const getRepositoriesSpy = new GetRepositoriesSpy()
    renderScreen(getRepositoriesSpy)
    makeValidSubmit()
    await Helper.waitForElement('data-table')
    populatePaginatorSelect('25')
    expect(getRepositoriesSpy.params?.per_page).toBe(25)
    expect(getRepositoriesSpy.callCount).toBe(2)
  })
})
