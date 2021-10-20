import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, ValidationBuilder } from '@/validation/validators'

export const makeRepositoriesListValidations = (): Validator => {
  return ValidatorComposite.build([
    ...ValidationBuilder.fieldName('name').required().build()
  ])
}
