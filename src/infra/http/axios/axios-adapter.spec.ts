import { AxiosAdapter } from './axios-adapter'
import axios from 'axios'
import { mockedAxiosResponse } from '@/infra/tests'
import {
  mockedBody,
  mockedHeaders,
  mockedHttpRequest,
  mockedHttpResponse,
  mockedMethod,
  mockedParams,
  mockedUrl
} from '@/data/tests'
import { HttpRequest } from '@/data/protocols'

jest.mock('axios', () => ({
  request: () => mockedAxiosResponse(mockedHttpResponse)
}))

const URL = mockedUrl()
const BODY = mockedBody()
const REQUEST_PARAMS = mockedHttpRequest({
  url: URL,
  body: BODY,
  method: mockedMethod(),
  headers: mockedHeaders(),
  params: mockedParams()
})

type SutTypes = {
  sut: AxiosAdapter<any, any>
}

const makeSut = (requestParams?: HttpRequest): SutTypes => {
  const sut = new AxiosAdapter()
  return { sut }
}

describe('AxiosAdapter', () => {
  test('Should call axios with the correct data', async () => {
    const { sut } = makeSut()
    const postSpy = jest.spyOn(axios, 'request')
    await sut.request(REQUEST_PARAMS)
    expect(postSpy).toHaveBeenCalledWith({
      url: REQUEST_PARAMS.url,
      method: REQUEST_PARAMS.method,
      data: REQUEST_PARAMS.body,
      headers: REQUEST_PARAMS.headers,
      params: REQUEST_PARAMS.params
    })
  })
  test('Should return a proper HttpResponse on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.request(REQUEST_PARAMS)
    expect(httpResponse).toEqual(mockedHttpResponse)
  })
  test('Should return a proper HttpResponse on failure', async () => {
    const { sut } = makeSut()
    jest.spyOn(axios, 'request').mockRejectedValueOnce({
      response: mockedAxiosResponse(mockedHttpResponse)
    })
    const result = await sut.request(REQUEST_PARAMS)
    expect(result).toEqual({
      statusCode: mockedHttpResponse.statusCode,
      body: mockedHttpResponse.body
    })
  })
})
