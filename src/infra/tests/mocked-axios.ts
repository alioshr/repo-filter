import { HttpResponse } from '@/data/protocols'

export const mockedAxiosResponse = (
  params: HttpResponse
): any => ({
  data: params.body,
  status: params.statusCode
})
