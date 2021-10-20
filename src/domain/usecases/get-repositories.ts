import { Paginator, Repository } from '@/domain/models'

export type QueryParamsDTO = {
  per_page: number
  page: number
  name: string
}

export interface GetRepositories {
  get: (params: QueryParamsDTO) => Promise<Paginator<Repository[]>>
}
