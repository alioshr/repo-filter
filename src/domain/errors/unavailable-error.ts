export class UnavailableError extends Error {
  constructor () {
    super('This service is currently unavailable. Please try again soon.')
    this.name = 'UnavailableError'
  }
}
