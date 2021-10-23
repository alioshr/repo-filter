export class ForbiddenError extends Error {
  constructor () {
    super('Search limit reached. Wait a a bit and try again later.')
    this.name = 'UnexpectedError'
  }
}
