import { HttpClient, HttpResponse, HttpStatusCode, HttpRequest } from '@/data/protocols'
import faker from 'faker'

export class HttpClientSpy<RequestBody, ResponseBody>
implements HttpClient<RequestBody, ResponseBody> {
  url: string = ''
  method: string = ''
  response: HttpResponse = {
    statusCode: HttpStatusCode.ok,
    body: faker.random.objectElement()
  }

  async request (
    data: HttpRequest<RequestBody>
  ): Promise<HttpResponse<ResponseBody>> {
    this.url = data.url
    this.method = data.method
    return this.response
  }
}
