import { checkCookieTokenExistence, CookieToken, getJwtPayload } from '@tuxsnct/api-module-auth'
import { graphql } from 'graphql'
import { Handler } from 'worktop'
import { parse } from 'worktop/cookie'
import { contextValue, GraphQLRequest, resolvers, schema } from '../resolvers'

const handleGraphQLRequest: Handler = async (request, response) => {
  const auth = request.headers.get('Authorization')
  const cookie = request.headers.get('Cookie')
  const body = await request.body() as GraphQLRequest

  response.setHeader('Content-Type', 'application/json')

  if (body && body.query) {
    if (auth && cookie && checkCookieTokenExistence(cookie)) {
      contextValue.user = await getJwtPayload([auth, (parse(cookie) as CookieToken).token].join('.'))
    }

    response.send(200, await graphql({ contextValue, rootValue: resolvers, schema, source: body.query }))
    return
  }
  response.send(400, {})
}

export {
  handleGraphQLRequest
}
