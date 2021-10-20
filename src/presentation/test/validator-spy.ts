import { Validator } from '../protocols'

export class ValidationSpy implements Validator {
  errorMessage: string | null = null
  fieldName: string | null = null
  inputData: {[key: string]: any} | null = null

  validate (fieldName: string, inputData: {[key: string]: any}): string {
    this.fieldName = fieldName
    this.inputData = inputData
    return this.errorMessage as string
  }
}
