import { FieldValidation } from '@/validation/protocols'
import { RequiredFieldValidator } from '@/validation/validators'
import { NoContentValidator } from '../null-or-empty/no-content'

export class ValidationBuilder {
  private constructor (
    private readonly fieldName: string,
    private readonly validations: FieldValidation[]
  ) {}

  static fieldName (fieldName: string): ValidationBuilder {
    return new ValidationBuilder(fieldName, [])
  }

  required (): ValidationBuilder {
    this.validations.push(new RequiredFieldValidator(this.fieldName))
    return this
  }

  noContent (): ValidationBuilder {
    this.validations.push(new NoContentValidator(this.fieldName))
    return this
  }

  build (): FieldValidation[] {
    return this.validations
  }
}
