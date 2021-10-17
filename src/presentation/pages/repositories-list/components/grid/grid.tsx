import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination } from '@material-ui/core'
import React from 'react'
import TablePaginationActions from '../pagination/pagination'
import Styles from './grid-styles.scss'

type Props = {
  rows: any[]
}

const Grid: React.FC<Props> = ({ rows }) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <TableContainer component={Paper} className={Styles.tableWrapper}>
    <Table>
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
        {(rowsPerPage > 0
          ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : rows
        ).map((row) => (
          <TableRow key={row.name}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell style={{ width: 240 }} align="right">
              {row.description}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              {row.created}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              {row.updated}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              {row.username} - {row.avatar}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              {row.stars}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              {row.repoUrl}
            </TableCell>
          </TableRow>
        ))}

        {emptyRows > 0 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={6} />
          </TableRow>
        )}
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

export default Grid
