export class NoContentError extends Error {
  constructor () {
    super('No content to display for the given input')
    this.name = 'NoContentError'
  }
}
