import { createContext, Dispatch, SetStateAction } from 'react'

export type StateTypes = {
  isLoading: boolean
  name?: string
  page: number
  rowsPerPage: number
  data: any[]
  mainError: string | null
}

export type RepositoriesStateTypes = {
  state: StateTypes
  setState: Dispatch<SetStateAction<StateTypes>>
}

export default createContext<RepositoriesStateTypes>(null as any)
