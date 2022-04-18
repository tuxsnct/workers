import { checkCookieTokenExistence, CookieToken, getJwtPayload } from '@tuxsnct/workers-module-auth'
import { graphql } from 'graphql'
import { Handler } from 'worktop'
import { parse } from 'worktop/cookie'
import { contextValue, GraphQLRequest, resolvers, schema } from '../resolvers'

const handleGraphQLRequest: Handler = async (request, response) => {
  let { code, data, headers }: ResponseItems = { code: 400, data: {}, headers: { 'content-type': 'application/json' } }

  const auth = request.headers.get('Authorization')
  const cookie = request.headers.get('Cookie')
  const body = await request.body() as GraphQLRequest

  if (body && body.query) {
    if (auth && cookie && checkCookieTokenExistence(cookie)) {
      contextValue.user = await getJwtPayload([auth, (parse(cookie) as CookieToken).token].join('.'))
    }

    code = 200
    data = await graphql({ contextValue, rootValue: resolvers, schema, source: body.query })
  }
  response.send(code, data, headers)
}

export {
  handleGraphQLRequest
}
