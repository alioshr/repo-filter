import { TableRow, TableCell } from '@material-ui/core'
import React from 'react'

type Props = {
  rows: any[]
  page: number
  rowsPerPage: number
}

const MainData: React.FC<Props> = ({ rows, page, rowsPerPage }) => {
  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default MainData
