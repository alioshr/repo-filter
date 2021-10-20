import React, { useContext } from 'react'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination
} from '@material-ui/core'
import TablePaginationActions from '../pagination/pagination'
import Skeleton from '../skeleton/skeleton'
import Styles from './data-table-styles.scss'
import MainError from '../main-error/main-error'
import MainData from '../main-data/main-data'
import RepositoryContext, { RepositoriesStateTypes } from '@/presentation/contexts/repository-context'

const DataTable: React.FC = () => {
  const { state, setState } = useContext<RepositoriesStateTypes>(RepositoryContext)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ): void => {
    setState((prevState) => ({ ...prevState, page: newPage }))
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setState((prevState) => ({ ...prevState, rowsPerPage: parseInt(event.target.value, 10) }))
    setState((prevState) => ({ ...prevState, page: 0 }))
  }

  return (
    <TableContainer component={Paper} className={Styles.tableWrapper}>
      <Table data-testid="data-table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Updated</TableCell>
            <TableCell align="right">User</TableCell>
            <TableCell align="right">Stars</TableCell>
            <TableCell align="right">Repo Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.isLoading && <Skeleton />}
          {state.mainError && <MainError />}
          {!state.mainError && !state.isLoading && <MainData
            page={state.page}
            rowsPerPage={state.rowsPerPage}
            rows={state.data}
            />}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={4}
              count={state.totalCount as number}
              rowsPerPage={state.rowsPerPage}
              page={state.page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per. page'
                },
                native: true
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default DataTable
