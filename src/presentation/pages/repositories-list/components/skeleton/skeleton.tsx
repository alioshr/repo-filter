import { TableBody } from '@material-ui/core'
import React from 'react'
import Styles from './skeleton-styles.scss'

const Skeleton: React.FC = () => (
  <TableBody>
    {Array(7)
      .fill(undefined)
      .map((a, i) => (
        <tr key={i} className={Styles.skeleton}>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      ))}
  </TableBody>
)

export default Skeleton
