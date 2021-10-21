import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import MainData from './main-data'
import faker from 'faker'
import { mockedRepositoriesPaginator } from '@/domain/tests'
import { Repository } from '@/domain/models'

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
    rows.items[0].description = faker.datatype.string(1000)
    rows.items[0].name = faker.datatype.string(1000)
    const sut = makeSut(rows.items)
    const nameCell = sut.getByTestId('name-cell')
    const descriptionCell = sut.getByTestId('description-cell')
    expect(nameCell.textContent).toHaveLength(200)
    expect(descriptionCell.textContent).toHaveLength(200)
  })
})
