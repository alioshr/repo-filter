import React from 'react'
import Styles from './skeleton-styles.scss'

const Skeleton: React.FC = () => (
  <React.Fragment>
    {Array(5)
      .fill(undefined)
      .map((a, i) => (
        <tr data-testid="grid-skeleton-row" key={i} className={Styles.skeleton}>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      ))}
  </ React.Fragment>
)

export default Skeleton
