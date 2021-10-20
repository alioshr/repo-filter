export interface FieldValidation {
  field: string
  validate: (inputData: {[key: string]: any}) => Error | null
}
