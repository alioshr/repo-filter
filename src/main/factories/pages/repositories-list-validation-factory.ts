import { ValidationBuilder } from '@/main/builders'
import { ValidatorComposite } from '@/main/composites'
import { Validator } from '@/presentation/protocols'

export const makeRepositoriesListValidations = (): Validator => {
  return ValidatorComposite.build([
    ...ValidationBuilder.fieldName('name').required().build(),
    ...ValidationBuilder.fieldName('items').noContent().build()
  ])
}
