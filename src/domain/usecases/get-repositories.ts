import { Paginator, Repository } from '@/domain/models'

export type QueryParamsDTO = {
  per_page: number
  page: number
  description?: string
  name?: string
  pushed?: Date
  created?: Date
  user?: string
  stars?: number
}

export interface GetRepositories {
  get: (params: QueryParamsDTO) => Promise<Paginator<Repository[]>>
}
