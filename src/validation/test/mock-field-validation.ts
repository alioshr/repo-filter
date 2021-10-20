import { FieldValidation } from '../protocols'

export class ValidatorSpy implements FieldValidation {
  error: Error | null = null
  constructor (public readonly field: string) {}
  validate (inputData: {[key: string]: any}): Error | null {
    return this.error
  }
}
