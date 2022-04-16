import { getJwtPayload } from '../../../../modules/auth/dist'
import { buildSchema } from 'graphql'
import { apiResolvers, apiSchema } from './api'
import { tuxsnctResolvers, tuxsnctSchema } from './tuxsnct'

export const schema = buildSchema(`
  ${apiSchema}
  ${tuxsnctSchema}

  type Query {
    api: API!
    tuxsnct: TUXSNCT!
  }
`)

export const resolvers = {
  api: apiResolvers,
  tuxsnct: tuxsnctResolvers
}

type ContextValue = {
  user: PromiseType<ReturnType<typeof getJwtPayload>>
}

export const contextValue: ContextValue = {
  // eslint-disable-next-line unicorn/no-null
  user: null
}

export type GraphQLRequest = { query?: string }
