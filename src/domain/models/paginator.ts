export type Paginator<DataType> = {
  incomplete_results: boolean
  items: DataType
  total_count: number
}
