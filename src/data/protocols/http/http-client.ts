import { HttpResponse } from './http-response'

export type methods = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type HttpRequest<Body = any, Params = any> = {
  url: string
  method: methods
  body?: Body
  headers?: any
  params?: Params
}

export interface HttpClient<RequestBody = any, ResponseBody = any> {
  request: (data: HttpRequest<RequestBody>) => Promise<HttpResponse<ResponseBody>>
}
