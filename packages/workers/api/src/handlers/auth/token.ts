import {
  checkCookieTokenExistence,
  CookieToken,
  getJwtPayload,
  getJwtTokens,
  generateCookie
} from '@tuxsnct/workers-module-auth'
import { Handler } from 'worktop'
import { parse } from 'worktop/cookie'

// eslint-disable-next-line max-statements
export const handleToken: Handler = async (request, response) => {
  let { code, data, headers }: ResponseItems = { code: 401, data: {}, headers: { 'content-type': 'application/json' } }
  const auth = request.headers.get('Authorization')
  const cookie = request.headers.get('Cookie')

  if (auth && cookie && checkCookieTokenExistence(cookie)) {
    const jwtPayload = await getJwtPayload([auth, (parse(cookie) as CookieToken).token].join('.'))
    const jwtTokens = jwtPayload && await getJwtTokens(jwtPayload, true)

    if (jwtTokens) {
      code = 200
      data = { token: jwtTokens.csrfToken }
      headers['set-cookie'] = generateCookie({ name: 'token', value: jwtTokens.cookieToken })
    }
  }
  response.send(code, data, headers)
}
