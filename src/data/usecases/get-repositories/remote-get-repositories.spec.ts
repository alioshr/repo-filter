import { HttpStatusCode } from '@/data/protocols'
import { HttpClientSpy, mockedUrl } from '@/data/tests'
import { UnavailableError, UnexpectedError } from '@/domain/errors'
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
  test('should throw UnexpectedError if HttpGetClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.forbidden }
    const promise = sut.get(MOCKED_PARAMS)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('should throw UnexpectedError if HttpGetClient returns 422', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.unprocessableEntity }
    const promise = sut.get(MOCKED_PARAMS)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('should throw UnexpectedError if HttpGetClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.serverError }
    const promise = sut.get(MOCKED_PARAMS)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('should throw UnavailableError if HttpGetClient returns 503', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.unavailable }
    const promise = sut.get(MOCKED_PARAMS)
    await expect(promise).rejects.toThrow(new UnavailableError())
  })
})
