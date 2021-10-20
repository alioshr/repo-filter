export interface Validator {
  validate: (fieldName: string, inputData: {[key: string]: any}) => string | null
}
