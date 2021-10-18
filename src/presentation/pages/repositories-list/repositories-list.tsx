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
    page: 1,
    rowsPerPage: 5,
    data: [],
    mainError: null
  })

  useEffect(() => {
    getRepositories
      .get({
        per_page: state.rowsPerPage,
        page: state.page
      })
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          data: res.items
        }))
      })
      .catch((err) =>
        setState((prevState) => ({ ...prevState, mainError: err.message }))
      )
  }, [])

  return (
    <RepositoryContext.Provider value={{ state, setState }}>
      <div className={Styles.surveyWrapper}>
        <h2 className={Styles.title}>Search for a repository: </h2>
        <div className={Styles.searchWrapper}>
          <form action="">
            <Input
              title="Type the repository name here"
              placeholder="Repository name"
              className={Styles.input}
              inputProps={{ classes: { underline: Styles.input } }}
              classes={{ underline: Styles.input }}
            />
            <Button className={Styles.submitButton}>Submit</Button>
          </form>
        </div>
        <DataTable />
      </div>
    </RepositoryContext.Provider>
  )
}

export default RepositoriesList
