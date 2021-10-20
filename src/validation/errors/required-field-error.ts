export class RequiredFieldError extends Error {
  constructor (field: string) {
    super(`${field} required!`)
    this.name = 'RequiredFieldError'
  }
}
