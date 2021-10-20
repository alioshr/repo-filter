import React from 'react'
import { RepositoriesList } from '@/presentation/pages'
import { makeRemoteGetRepositories } from '../usecases/get-repositories/get-repositories-factory'
import { makeRepositoriesListValidations } from './repositories-list-validation-factory'

export const makeRepositoriesList: React.FC = () => (
  <RepositoriesList
    validator={makeRepositoriesListValidations()}
    getRepositories={makeRemoteGetRepositories()}
  />
)
