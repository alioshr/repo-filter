import { HttpClient, HttpResponse, HttpStatusCode, HttpRequest } from '@/data/protocols'
export class HttpClientSpy<RequestBody, ResponseBody>
implements HttpClient<RequestBody, ResponseBody> {
  url: string = ''
  method: string = ''
  params: object = {}
  response: HttpResponse = {
    statusCode: HttpStatusCode.ok
  }

  async request (
    data: HttpRequest<RequestBody>
  ): Promise<HttpResponse<ResponseBody>> {
    this.url = data.url
    this.method = data.method
    this.params = data.params as object
    return this.response
  }
}
