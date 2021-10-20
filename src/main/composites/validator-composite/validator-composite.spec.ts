import { Validator } from '@/presentation/protocols'
import { ValidatorSpy } from '@/validation/test/mock-field-validation'
import { ValidatorComposite } from './validator-composite'
import faker from 'faker'

const FAKE_FIELD = faker.database.column()

const inputData = {
  fake_field: faker.database.column()
}

type SutTypes = {
  sut: Validator
  validatorSpies: ValidatorSpy[]
}

const makeSut = (): SutTypes => {
  const validatorSpies = [
    new ValidatorSpy(FAKE_FIELD),
    new ValidatorSpy(FAKE_FIELD),
    new ValidatorSpy(FAKE_FIELD)
  ]
  const sut = ValidatorComposite.build(validatorSpies)
  return { sut, validatorSpies }
}

describe('ValidatorComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validatorSpies } = makeSut()
    const errorMessage = faker.random.word()
    validatorSpies[1].error = new Error(errorMessage)
    const result = sut.validate(FAKE_FIELD, inputData)
    expect(result).toEqual(errorMessage)
  })
  test('Should return null if all validations pass', () => {
    const { sut } = makeSut()
    const result = sut.validate(FAKE_FIELD, inputData)
    expect(result).toBe(null)
  })
  test('Should return null if any fields match the validation requirements', () => {
    const { sut } = makeSut()
    const result = sut.validate(FAKE_FIELD, inputData)
    expect(result).toBe(null)
  })
  test('Should return the first error if any validations fail', () => {
    const { sut, validatorSpies } = makeSut()
    const firstErrorMessage = faker.random.word()
    validatorSpies[1].error = new Error(firstErrorMessage)
    validatorSpies[2].error = new Error(faker.random.word())
    const result = sut.validate(FAKE_FIELD, inputData)
    expect(result).toEqual(firstErrorMessage)
  })
})
