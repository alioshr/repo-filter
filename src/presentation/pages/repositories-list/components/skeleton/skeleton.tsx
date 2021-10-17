import React from 'react'
import Styles from './skeleton-styles.scss'

const Skeleton: React.FC = () => (
  <React.Fragment>
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
  </ React.Fragment>
)

export default Skeleton
