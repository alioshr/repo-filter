import React from 'react'
import Styles from './skeleton-styles.scss'

const Skeleton: React.FC = () => (
  <tr className={Styles.skeleton}>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
)

export default Skeleton
