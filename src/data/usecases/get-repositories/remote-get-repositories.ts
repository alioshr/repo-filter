import { HttpClient, HttpStatusCode } from '@/data/protocols'
import { UnavailableError, UnexpectedError } from '@/domain/errors'
import { Paginator, Repository } from '@/domain/models'
import { GetRepositories, QueryParamsDTO } from '@/domain/usecases/get-repositories'

export class RemoteGetRepositories implements GetRepositories {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async get (params: QueryParamsDTO): Promise<Paginator<Repository[]>> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'GET',
      params
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      case HttpStatusCode.notModified: return httpResponse.body
      case HttpStatusCode.unavailable: throw new UnavailableError()
      default: throw new UnexpectedError()
    }
  }
}
