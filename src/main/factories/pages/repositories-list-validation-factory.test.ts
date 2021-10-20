import { ValidationBuilder } from '@/main/builders'
import { ValidatorComposite } from '@/main/composites'
import { makeRepositoriesListValidations } from './repositories-list-validation-factory'

jest.mock('@/main/composites/validator-composite/validator-composite')

describe('RepositoriesListValidationFactory', () => {
  test('ensure Validator Composite is called with the correct validations', () => {
    makeRepositoriesListValidations()
    expect(ValidatorComposite.build).toHaveBeenCalledWith([
      ...ValidationBuilder.fieldName('name').required().build(),
      ...ValidationBuilder.fieldName('items').noContent().build()
    ])
  })
})
