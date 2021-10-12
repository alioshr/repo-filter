import { Paginator, Repository } from '@/domain/models'

export type QueryParamsDTO = {
  description: string
  name: string
  pushed: Date
  created: Date
  user: string
  stars: number
  per_page: number
  page: number
}

export interface GetRepositories {
  get: (params: QueryParamsDTO) => Promise<Paginator<Repository[]>>
}
