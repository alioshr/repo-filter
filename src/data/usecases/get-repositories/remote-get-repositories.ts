import { HttpClient } from '@/data/protocols'
import { Paginator, Repository } from '@/domain/models'
import { GetRepositories, QueryParamsDTO } from '@/domain/usecases/get-repositories'

export class RemoteGetRepositories implements GetRepositories {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async get (params: QueryParamsDTO): Promise<Paginator<Repository[]>> {
    await this.httpClient.request({ url: this.url, method: 'GET' })
    return (await Promise.resolve(null)) as any
  }
}
