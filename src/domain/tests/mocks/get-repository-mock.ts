import { QueryParamsDTO } from '@/domain/usecases/get-repositories'
import faker from 'faker'

export const mockedQueryParamsDTO = (): QueryParamsDTO => ({
  page: faker.datatype.number(),
  per_page: faker.datatype.number(),
  created: faker.date.recent(),
  pushed: faker.date.recent(),
  description: faker.random.words(5),
  name: faker.random.word(),
  user: faker.random.word(),
  stars: faker.datatype.number()
})
