import {
  checkCookieTokenExistence,
  CookieToken,
  getJwtPayload,
  getJwtTokens,
  setCookie
} from '@tuxsnct/workers-module-auth'
import { Handler } from 'worktop'
import { parse } from 'worktop/cookie'

// eslint-disable-next-line max-statements
export const handleToken: Handler = async (request, response) => {
  const auth = request.headers.get('Authorization')
  const cookie = request.headers.get('Cookie')

  if (auth && cookie && checkCookieTokenExistence(cookie)) {
    const jwtPayload = await getJwtPayload([auth, (parse(cookie) as CookieToken).token].join('.'))
    const jwtTokens = jwtPayload && await getJwtTokens(jwtPayload)

    if (jwtTokens) {
      setCookie(response, { name: 'token', value: jwtTokens.cookieToken })
      response.setHeader('Content-Type', 'application/json')
      response.send(200, { token: jwtTokens.csrfToken })
      return
    }
  }
  response.send(401, {})
}
