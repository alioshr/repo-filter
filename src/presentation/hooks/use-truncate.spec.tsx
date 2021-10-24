import React from 'react'
import { useTruncate } from './use-truncate'
import faker from 'faker'
import { render, RenderResult } from '@testing-library/react'

const TestComponent: React.FC<{ text: string, limit: number }> = ({
  text, limit
}) => {
  return <div data-testid="el">{useTruncate(text, limit)}</div>
}

const makeSut = (text: string, limit: number): RenderResult =>
  render(<TestComponent text={text} limit={limit} />)

describe('useTruncate', () => {
  test('Should not change text when <= to limit', () => {
    const text = faker.random.word()
    const sut = makeSut(text, 500)
    expect(sut.getByTestId('el').textContent).toEqual(text)
  })
  test('Should return an empty string if text is null', () => {
    const text = null as any
    const sut = makeSut(text, 500)
    expect(sut.getByTestId('el').textContent).toEqual('')
  })
  test('Should return an empty string if text is undefined', () => {
    const text = undefined as any
    const sut = makeSut(text, 500)
    expect(sut.getByTestId('el').textContent).toEqual('')
  })
  test('Should slice the first word + ... if its length is higher than the limit', () => {
    const text = `${faker.datatype.string(1000)} ${faker.random.word()}`
    const sut = makeSut(text, 100)
    expect(sut.getByTestId('el').textContent).toEqual(text.split(' ')[0].slice(0, 100).concat('...'))
  })
  test('Should truncate preserving full words when text length is higher than the limit with many words', async () => {
    const firstWord = faker.datatype.string(9)
    const secondWord = faker.datatype.string(10)
    const thirdWord = faker.datatype.string(10)
    const text = `${firstWord} ${secondWord} ${thirdWord}`
    const sut = makeSut(text, 20)
    expect(sut.getByTestId('el').textContent).toEqual(`${firstWord} ${secondWord}...`)
  })
})
