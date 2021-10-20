import { FieldValidation } from '@/validation/protocols'
import { RequiredFieldError } from '@/validation/errors'

export class RequiredFieldValidator implements FieldValidation {
  constructor (public readonly field: string) {}

  validate (inputData: {[key: string]: any}): Error | null {
    return inputData[this.field] ? null : new RequiredFieldError(this.field)
  }
}
