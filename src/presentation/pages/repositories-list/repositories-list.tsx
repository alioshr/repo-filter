import React from 'react'
import Styles from './repositories-list-styles.scss'
import DataTable from './components/data-table/data-table'
import { Input, Button } from '@material-ui/core'

const RepositoriesList: React.FC = () => {
  return (
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
      <DataTable rows={rows} />
    </div>
  )
}

function createData (
  name: any,
  description: any,
  created: any,
  updated: any,
  username: any,
  avatar: any,
  stars: any,
  repoUrl: any
): any {
  return {
    name,
    description,
    created,
    updated,
    username,
    avatar,
    stars,
    repoUrl
  }
}

const rows = [
  createData(
    'Repository name',
    'pretty cool repo',
    '10 feb 2021',
    '10 oct 2021',
    'alioshr',
    'avatar',
    12,
    'repo url'
  ),
  createData(
    'Repository name123',
    'pretty cool repo',
    '10 feb 2021',
    '10 oct 2021',
    'alioshr',
    'avatar',
    12,
    'repo url'
  ),
  createData(
    'Repository name11',
    'pretty cool repo',
    '10 feb 2021',
    '10 oct 2021',
    'alioshr',
    'avatar',
    12,
    'repo url'
  ),
  createData(
    'Repository name8',
    'pretty cool repo',
    '10 feb 2021',
    '10 oct 2021',
    'alioshr',
    'avatar',
    12,
    'repo url'
  ),
  createData(
    'Repository name5',
    'pretty cool repo',
    '10 feb 2021',
    '10 oct 2021',
    'alioshr',
    'avatar',
    12,
    'repo url'
  ),
  createData(
    'Repository name4',
    'pretty cool repo',
    '10 feb 2021',
    '10 oct 2021',
    'alioshr',
    'avatar',
    12,
    'repo url'
  ),
  createData(
    'Repository name3',
    'pretty cool repo',
    '10 feb 2021',
    '10 oct 2021',
    'alioshr',
    'avatar',
    12,
    'repo url'
  ),
  createData(
    'Repository name1',
    'pretty cool repo',
    '10 feb 2021',
    '10 oct 2021',
    'alioshr',
    'avatar',
    12,
    'repo url'
  )
].sort((a, b) => (a.stars < b.stars ? -1 : 1))

export default RepositoriesList
