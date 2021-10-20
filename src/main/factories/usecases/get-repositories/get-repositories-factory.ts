import { RemoteGetRepositories } from '@/data/usecases/get-repositories/remote-get-repositories'
import { GetRepositories } from '@/domain/usecases/get-repositories'
import { HttpGetRepositoriesListDecorator } from '@/main/decorators/http-get-repositories-list-decorator'
import { makeAxiosHttpClient } from '../../http/axios-client-factory'

export const makeRemoteGetRepositories = (): GetRepositories => {
  return new RemoteGetRepositories(
    'https://api.github.com/search/repositories',
    new HttpGetRepositoriesListDecorator(makeAxiosHttpClient())
  )
}
