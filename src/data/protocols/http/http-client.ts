import { HttpResponse } from './http-response'

export type methods = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type HttpRequest<RequestBody = any> = {
  url: string
  method: methods
  body?: RequestBody
  headers?: any
  params?: object
}

export interface HttpClient<RequestBody = any, ResponseBody = any> {
  request: (data: HttpRequest<RequestBody>) => Promise<HttpResponse<ResponseBody>>
}
