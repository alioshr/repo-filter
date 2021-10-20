import { NoContentError } from '@/validation/errors'
import { FieldValidation } from '@/validation/protocols'

export class NoContentValidator implements FieldValidation {
  constructor (public readonly field: string) {}

  validate (inputData: {[key: string]: any}): Error | null {
    return inputData[this.field].length > 0 ? null : new NoContentError()
  }
}
