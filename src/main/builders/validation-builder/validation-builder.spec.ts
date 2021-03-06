import { RequiredFieldValidator } from '@/validation/validators'
import { NoContentValidator } from '../../../validation/validators/no-content/no-content'
import { ValidationBuilder as sut } from './validation-builder'
import faker from 'faker'

const field = faker.database.column()

describe('ValidationBuilder', () => {
  test('Should call RequiredFieldValidation with the correct param', () => {
    const validations = sut.fieldName(field)
      .required()
      .build()
    expect(validations).toEqual([new RequiredFieldValidator(field)])
  })
  test('Should have the correct number of Validation dependencies', () => {
    const validations = sut.fieldName(field).required().noContent().build()
    expect(validations).toEqual([new RequiredFieldValidator(field), new NoContentValidator(field)])
    expect(validations.length).toBe(2)
  })
})
