import { Paginator, Repository } from '@/domain/models'
import { GetRepositories, QueryParamsDTO } from '@/domain/usecases/get-repositories'

export class GetRepositoriesSpy implements GetRepositories {
  callCount = 0
  params: QueryParamsDTO | null = null
  response: Paginator<Repository[]> | Error = {
    incomplete_results: false,
    total_count: 1,
    items: []
  }

  async get (params: QueryParamsDTO): Promise<Paginator<Repository[]>> {
    this.params = params
    this.callCount = this.callCount + 1
    return this.response as any
  }
}
