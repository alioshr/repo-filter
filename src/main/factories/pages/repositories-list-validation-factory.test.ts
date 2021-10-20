import { ValidationBuilder, ValidatorComposite } from '@/validation/validators'
import { makeRepositoriesListValidations } from './repositories-list-validation-factory'

jest.mock('@/validation/validators/composite/validator-composite')

describe('RepositoriesListValidationFactory', () => {
  test('ensure Validator Composite is called with the correct validations', () => {
    makeRepositoriesListValidations()
    expect(ValidatorComposite.build).toHaveBeenCalledWith([
      ...ValidationBuilder.fieldName('name').required().build(),
      ...ValidationBuilder.fieldName('items').noContent().build()
    ])
  })
})
