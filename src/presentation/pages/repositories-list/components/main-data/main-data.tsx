import { Repository } from '@/domain/models'
import { TableRow, TableCell } from '@material-ui/core'
import React from 'react'
import Styles from './main-data-styles.scss'

type Props = {
  rows: Repository[]
}

const MainData: React.FC<Props> = ({ rows }) => {
  return (
    <React.Fragment>
      {rows.map((row, index) => (
        <TableRow
          data-testid={`row-${index}`}
          key={index}
          className={Styles.dataRow}
        >
          <TableCell component="th" scope="row" data-testid="name-cell">
            {row.name?.split('', 200)}
          </TableCell>
          <TableCell style={{ width: 240 }} align="right" data-testid="description-cell">
            {row.description?.split('', 200)}
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            {new Date(row.created_at).getMonth() + 1}/
            {new Date(row.created_at).getDate()}/
            {new Date(row.created_at).getFullYear()}
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            {new Date(row.updated_at).getMonth() + 1}/
            {new Date(row.updated_at).getDate()}/
            {new Date(row.updated_at).getFullYear()}
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            <div className={Styles.ownerWrapper}>
              <img
                className={Styles.avatar}
                src={row.owner.avatar_url}
                alt="avatar"
              />
              <span>{row.owner.login}</span>
            </div>
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            <div className={Styles.starsWrapper}>
            <img src="data:image/png;base64,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Gn9fUV44k3wAubq64uOP20rkoJ/1lLi4OIkkW7ZsBf2cktAOActiY+6cym00O/ffxrQA+ateJgglhDKpqEWQJg0KYuygkjJEfjpyB6G7YnHK6syENWwUJShaEDEoejhTKIoQUSiqUHRJSehKB1pspIhCmyMtMi3gKnbulydwYIKYmCBLli7FsmXLFWOJSPJh40KgN1NHTsTj19/kWzDUBh/NL2iekd75pGheQvMTmqekJqVL5kTjegVQvkwuhB2+g+17YxVVOnf+FF8OGpRaU4b93tSPWFFR0WjZqlWanEtvpChi0BuqjCT0posiCr35SouEbN0CLy9zHBxTw8nUBCFAKJs7ZXW3V2gNg4hBaxoZWWjthIhCayn2So8en6F/v372VjNUedMThLw5ecoUbNtmW5obWvWm1W9aBRdJaDWeVuVpdd4Wadu2DUaOGGFLUUOXYYIkuXfq1GkICQ19rbNpnxRFDNo3JbLQ/i6KKNYbNC19ov1X1EcmxytEmCDJRjvNSbZs2YKzyXb30oWWlatUNlwKnLCwfQjbFwb6dHd3h7u7m3Q4qsUHH5h6zmH9x48JInI4YNt1R4AJojvErEBkBJggInuPbdcdASaI7hCzApERYIKI7D22XXcEmCC6Q8wKREaACSKy99h23RFggugOMSsQGQEmiMjeY9t1R4AJojvErEBkBJggInuPbdcdASaI7hCzApERYIKI7D22XXcEmCC6Q8wKREaACSKy99h23RFggugOMSsQGQEmiMjeY9t1R4AJojvErEBkBJggInuPbdcdASaI7hCzApERYIKI7D22XXcEmCC6Q8wKREaACSKy99h23RFggugOMSsQGQEmiMjeY9t1R4AJojvErEBkBJggInuPbdcdASaI7hCzApERYIKI7D22XXcEmCC6Q8wKREaACSKy99h23RFggugOMSsQGQEmiMjeY9t1R4AJojvErEBkBJggInuPbdcdASaI7hCzApERYIKI7D22XXcEmCC6Q8wKREaACSKy99h23RFggugOMSsQGQEmiMjeY9t1R4AJojvErEBkBJggInuPbdcdASaI7hCzApERYIKI7D22XXcEmCC6Q8wKREaACSKy99h23RFggugOMSsQGQEmiMjeY9t1R4AJojvErEBkBJggInuPbdcdASaI7hCzApER+C9WwQo/XC8x4QAAAABJRU5ErkJggg==" alt="" />
            <span>{row.stargazers_count}</span>
            </div>
          </TableCell>
          <TableCell style={{ width: 160 }} align="right">
            <a href={row.html_url}>{row.html_url}</a>
          </TableCell>
        </TableRow>
      ))}
    </React.Fragment>
  )
}

export default MainData
