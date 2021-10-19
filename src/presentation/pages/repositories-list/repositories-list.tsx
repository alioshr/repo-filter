import React, { useEffect, useState } from 'react'
import Styles from './repositories-list-styles.scss'
import DataTable from './components/data-table/data-table'
import { Input, Button } from '@material-ui/core'
import RepositoryContext, {
  StateTypes
} from '@/presentation/contexts/repository-context'
import { GetRepositories } from '@/domain/usecases/get-repositories'

type Props = {
  getRepositories: GetRepositories
}

const RepositoriesList: React.FC<Props> = ({ getRepositories }) => {
  const [state, setState] = useState<StateTypes>({
    isLoading: true,
    name: '',
    page: 0,
    rowsPerPage: 5,
    totalCount: 0,
    data: [],
    mainError: null
  })

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true
    }))
    getRepositories
      .get({
        per_page: state.rowsPerPage,
        page: state.page + 1
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
  }, [state.page, state.rowsPerPage])

  const handleSearchQuery = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setState((prevState) => ({
      ...prevState,
      isLoading: true
    }))
    await getRepositories.get({
      per_page: state.rowsPerPage,
      page: state.page + 1,
      name: state.name
    })
  }
  return (
    <RepositoryContext.Provider value={{ state, setState }}>
      <div className={Styles.surveyWrapper}>
        <h2 className={Styles.title}>Search for a repository: </h2>
        <div className={Styles.searchWrapper}>
          <form action="" onSubmit={handleSearchQuery}>
            <Input
              data-testid="name-input"
              title="Type the repository name here"
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
            disabled={state.isLoading}
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
