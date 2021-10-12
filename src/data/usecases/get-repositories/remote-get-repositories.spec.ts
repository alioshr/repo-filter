import { HttpClientSpy, mockedUrl } from '@/data/tests'
import { Paginator, Repository } from '@/domain/models'
import { mockedQueryParamsDTO } from '@/domain/tests'
import {
  GetRepositories,
  QueryParamsDTO
} from '@/domain/usecases/get-repositories'
import { RemoteGetRepositories } from './remote-get-repositories'

const MOCKED_PARAMS = mockedQueryParamsDTO()
const URL = mockedUrl()

type SutTypes = {
  sut: GetRepositories
  httpClientSpy: HttpClientSpy<QueryParamsDTO, Paginator<Repository[]>>
}

const makeSut = (): SutTypes => {
  const httpClientSpy = new HttpClientSpy<QueryParamsDTO, Paginator<Repository[]>>()
  const sut = new RemoteGetRepositories(URL, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteGetRepositories', () => {
  test('Should call HttpClient with the correct url and method', async () => {
    const { sut, httpClientSpy } = makeSut()
    await sut.get(MOCKED_PARAMS)
    expect(httpClientSpy.url).toBe(URL)
    expect(httpClientSpy.method).toBe('GET')
  })
  test('Should call HttpClient with the correct params', async () => {
    const { sut, httpClientSpy } = makeSut()
    await sut.get(MOCKED_PARAMS)
    expect(httpClientSpy.params).toBe(MOCKED_PARAMS)
  })
})
