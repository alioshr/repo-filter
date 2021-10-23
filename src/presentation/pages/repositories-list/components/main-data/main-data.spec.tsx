import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import MainData from './main-data'
import faker from 'faker'
import { mockedRepositoriesPaginator } from '@/domain/tests'
import { Repository } from '@/domain/models'
import { useTruncate } from '@/presentation/hooks'

const makeSut = (
  rows: Repository[]
): RenderResult => {
  return render(
      <MainData
        rows={rows}
      />
  )
}

describe('MainData', () => {
  test('Should limit the description and name to 200 chars', () => {
    const rows = mockedRepositoriesPaginator()
    const name = faker.random.words(1000)
    const description = faker.random.words(1000)
    rows.items[0].description = description
    rows.items[0].name = name
    const sut = makeSut(rows.items)
    const nameCell = sut.getByTestId('name-cell')
    const descriptionCell = sut.getByTestId('description-cell')
    expect(nameCell.textContent).toBe(useTruncate(name, 200))
    expect(descriptionCell.textContent).toBe(useTruncate(description, 200))
  })
  test('Should show no content if no description and name exist', () => {
    const rows = mockedRepositoriesPaginator()
    rows.items[0].description = null as any
    rows.items[0].name = null as any
    const sut = makeSut(rows.items)
    const nameCell = sut.getByTestId('name-cell')
    const descriptionCell = sut.getByTestId('description-cell')
    expect(nameCell.textContent).toHaveLength(0)
    expect(descriptionCell.textContent).toHaveLength(0)
  })
})
