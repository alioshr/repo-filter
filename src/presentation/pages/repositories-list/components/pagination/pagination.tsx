import { Box, IconButton, useTheme } from '@material-ui/core'
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import React from 'react'

type Props = {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: any
}

const TablePaginationActions: React.FC<Props> = ({
  count,
  page,
  rowsPerPage,
  onPageChange
}) => {
  const theme = useTheme<any>()

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null
  ): void => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null
  ): void => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null
  ): void => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null
  ): void => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        data-testid="first-page"
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        data-testid="back-page"
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl'
          ? (
          <KeyboardArrowRight />
            )
          : (
          <KeyboardArrowLeft />
            )}
      </IconButton>
      <IconButton
        data-testid="next-page"
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl'
          ? (
          <KeyboardArrowLeft />
            )
          : (
          <KeyboardArrowRight />
            )}
      </IconButton>
      <IconButton
        data-testid="last-page"
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

export default TablePaginationActions
