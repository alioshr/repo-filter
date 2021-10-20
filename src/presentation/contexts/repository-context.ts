import { Repository } from '@/domain/models'
import { createContext, Dispatch, SetStateAction } from 'react'

export type StateTypes = {
  isLoading: boolean
  name: string
  page: number
  rowsPerPage: number
  totalCount: number | null
  data: Repository[]
  mainError: string | null
  nameError: string | null
}

export type RepositoriesStateTypes = {
  state: StateTypes
  setState: Dispatch<SetStateAction<StateTypes>>
}

export default createContext<RepositoriesStateTypes>(null as any)
