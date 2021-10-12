import faker from 'faker'
import { HttpRequest, HttpResponse, HttpStatusCode } from '../../protocols'

export const mockedUrl = (): any => faker.internet.url()
export const mockedBody = (): any => faker.random.objectElement()
export const mockedHeaders = (): any => faker.random.objectElement()
export const mockedMethod = (): any => faker.helpers.randomize(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
export const mockedParams = (): any => faker.random.objectElement()

export const mockedHttpRequest = (
  data: HttpRequest
): HttpRequest => ({
  url: data.url,
  method: data.method,
  body: data.body
})

export const mockedHttpResponse: HttpResponse = {
  body: faker.random.objectElement(),
  statusCode: HttpStatusCode.ok
}
