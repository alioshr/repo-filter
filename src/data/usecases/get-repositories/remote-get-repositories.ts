import { HttpClient, HttpStatusCode } from '@/data/protocols'
import { UnexpectedError } from '@/domain/errors'
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
      case HttpStatusCode.ok: return null as any
      default: throw new UnexpectedError()
    }
  }
}
