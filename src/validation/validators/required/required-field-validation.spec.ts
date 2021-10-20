import faker from 'faker'

import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidator } from './required-field-validation'

const FIELD = 'email'

const makeSut = (field: string): RequiredFieldValidator =>
  new RequiredFieldValidator(field)

describe('RequiredFieldValidation', () => {
  test('Should return an error if field is empty', () => {
    const sut = makeSut(FIELD)
    const result = sut.validate({ email: '' })
    expect(result).toEqual(new RequiredFieldError(FIELD))
  })
  test('Should return null if field is filled', () => {
    const sut = makeSut(FIELD)
    const result = sut.validate({ email: faker.internet.email() })
    expect(result).toBe(null)
  })
})
