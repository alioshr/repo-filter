export enum HttpStatusCode {
  ok = 200,
  notModified = 304,
  forbidden = 403,
  unprocessableEntity = 422,
  serverError = 500,
  unavailable = 503
}

export type HttpResponse<BodyType = any> = {
  statusCode: HttpStatusCode
  body?: BodyType
}
