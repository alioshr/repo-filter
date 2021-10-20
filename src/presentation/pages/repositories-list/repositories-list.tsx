import React, { useEffect, useState } from 'react'
import Styles from './repositories-list-styles.scss'
import DataTable from './components/data-table/data-table'
import { Input, Button } from '@material-ui/core'
import RepositoryContext, {
  StateTypes
} from '@/presentation/contexts/repository-context'
import { GetRepositories } from '@/domain/usecases/get-repositories'
import { Validator } from '@/presentation/protocols'

type Props = {
  getRepositories: GetRepositories
  validator: Validator
}

const RepositoriesList: React.FC<Props> = ({ getRepositories, validator }) => {
  const [skipCount, setSkipCount] = useState(true)
  const [state, setState] = useState<StateTypes>({
    isLoading: false,
    name: '',
    nameError: '',
    page: 0,
    rowsPerPage: 5,
    totalCount: 0,
    data: [],
    mainError: 'try me out'
  })

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      nameError: validator.validate('name', { name: state.name })
    }))
  }, [state.name])

  useEffect(() => {
    if (skipCount) setSkipCount(false)
    if (!skipCount) {
      setState((prevState) => ({
        ...prevState,
        mainError: null,
        isLoading: true
      }))
      getRepositories
        .get({
          per_page: state.rowsPerPage,
          page: state.page + 1,
          name: state.name
        })
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            data: res.items,
            totalCount: res.total_count,
            isLoading: false
          }))
        })
        .catch((err) => {
          setState((prevState) => ({
            ...prevState,
            mainError: err.message,
            isLoading: false
          }))
        })
    }
  }, [state.page, state.rowsPerPage])

  const handleSearchQuery = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (state.nameError) {
      return
    }
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      mainError: null
    }))
    try {
      const repositories = await getRepositories.get({
        per_page: state.rowsPerPage,
        page: state.page + 1,
        name: state.name
      })
      setState((prevState) => ({
        ...prevState,
        data: repositories.items,
        totalCount: repositories.total_count,
        isLoading: false
      }))
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        mainError: error.message,
        isLoading: false
      }))
    }
  }

  return (
    <RepositoryContext.Provider value={{ state, setState }}>
      <div className={Styles.surveyWrapper}>
        <h2 className={Styles.title}>Search for a repository: </h2>
        <div className={Styles.searchWrapper}>
          <form action="" onSubmit={handleSearchQuery} data-testid="form">
            <Input
              data-testid="name-input"
              title={state.nameError ?? ''}
              placeholder="Repository name"
              className={Styles.input}
              inputProps={{ classes: { underline: Styles.input } }}
              classes={{ underline: Styles.input }}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  name: e.target.value
                }))}
            />
            <Button
            disabled={state.isLoading || !!state.nameError}
            data-testid="submit-button"
            type="submit"
            className={Styles.submitButton}>
              Submit
            </Button>
          </form>
        </div>
        <DataTable />
      </div>
    </RepositoryContext.Provider>
  )
}

export default RepositoriesList
