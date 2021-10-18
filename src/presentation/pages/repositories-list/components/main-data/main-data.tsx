import { Repository } from '@/domain/models'
import { TableRow, TableCell } from '@material-ui/core'
import React from 'react'
import Styles from './main-data-styles.scss'

type Props = {
  rows: Repository[]
  page: number
  rowsPerPage: number
}

const MainData: React.FC<Props> = ({ rows, page, rowsPerPage }) => {
  // const emptyRows =
  // page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
  return (
    <React.Fragment>
      {(rowsPerPage > 0
        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : rows
      ).map((row, index) => (
        <TableRow data-testid={`row-${index}`} key={row.name} className={Styles.dataRow}>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell style={{ width: 240 }} align="right">
            {row.description}
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            {new Date(row.created_at).getMonth() + 1}/{new Date(row.created_at).getDate()}/{new Date(row.created_at).getFullYear()}
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
          {new Date(row.updated_at).getMonth() + 1}/{new Date(row.updated_at).getDate()}/{new Date(row.updated_at).getFullYear()}
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            <span>{row.owner.login}</span>
            <img src={row.owner.avatar_url} alt="avatar"/>
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            {row.stargazers_count}
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            <a href={row.html_url}>{row.html_url}</a>
          </TableCell>
        </TableRow>
      ))}

      {/* {emptyRows > 0 && (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell colSpan={6} />
        </TableRow>
      )} */}
    </React.Fragment>
  )
}

export default MainData
