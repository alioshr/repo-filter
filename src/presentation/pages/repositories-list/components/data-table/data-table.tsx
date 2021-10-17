import React from 'react'
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

type Props = {
  rows: any[]
}

const DataTable: React.FC<Props> = ({ rows }) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <TableContainer component={Paper} className={Styles.tableWrapper}>
      <Table >
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
          <Skeleton />
          <MainError />
          <MainData
            page={page}
            rowsPerPage={rowsPerPage}
            rows={rows}
            />
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={4}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
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
