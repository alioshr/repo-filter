import { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols'

export class HttpGetRepositoriesListDecorator implements HttpClient {
  constructor (private readonly httpClient: HttpClient) {}
  async request (data: HttpRequest<any, {name: string, q: string}>): Promise<HttpResponse> {
    data.headers = {
      ...data.headers,
      accept: 'application/vnd.github.v3+json'
    }

    if (data.params) {
      data.params = {
        ...data.params,
        q: `${data?.params.name} in:name`
      }
    }

    return await this.httpClient.request(data)
  }
}
