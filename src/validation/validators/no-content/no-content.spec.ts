import faker from 'faker'

import { NoContentError } from '@/validation/errors'
import { NoContentValidator } from './no-content'

const FIELD = 'data'

const makeSut = (field: string): NoContentValidator =>
  new NoContentValidator(field)

describe('NoContent', () => {
  test('Should return an error if there is no content on an array', () => {
    const sut = makeSut(FIELD)
    const result = sut.validate({ data: [] })
    expect(result).toEqual(new NoContentError())
  })
  test('Should return null if data is present', () => {
    const sut = makeSut(FIELD)
    const result = sut.validate({ data: [faker.random.word()] })
    expect(result).toBe(null)
  })
})
