import { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols'
import axios from 'axios'

export class AxiosAdapter<RequestBody, ResponseBody>
implements HttpClient {
  async request (
    data: HttpRequest<RequestBody>
  ): Promise<HttpResponse<ResponseBody>> {
    await axios.request({
      url: data.url,
      method: data.method,
      headers: data.headers,
      data: data.body,
      params: data.params
    })
    return await Promise.resolve(null) as any
  }
}
