import { QueryParamsDTO } from '@/domain/usecases/get-repositories'
import faker from 'faker'

export const mockedQueryParamsDTO = (): QueryParamsDTO => ({
  page: faker.datatype.number(),
  per_page: faker.datatype.number(),
  name: faker.random.word()
})
