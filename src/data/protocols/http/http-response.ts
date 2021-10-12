export enum HttpStatusCode {
  ok = 200,
  noContent = 204,
  unauthorized = 401,
  badRequest = 400,
  forbidden = 403,
  notFound = 404,
  serverError = 500
}

export type HttpResponse<BodyType = any> = {
  statusCode: HttpStatusCode
  body?: BodyType
}
