import { Validator } from '@/presentation/protocols'
import { FieldValidation } from '@/validation/protocols'

export class ValidatorComposite implements Validator {
  private constructor (private readonly validators: FieldValidation[]) {}

  static build (validators: FieldValidation[]): ValidatorComposite {
    return new ValidatorComposite(validators)
  }

  validate (fieldName: string, inputData: {[key: string]: any}): string | null {
    const validators = this.validators.filter(validator => validator.field === fieldName)
    for (const validator of validators) {
      const error = validator.validate(inputData)
      if (error) {
        return error.message
      }
    }
    return null
  }
}
