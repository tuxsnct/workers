import {
  checkCookieTokenExistence,
  CookieToken,
  generateCookie,
  getJwtPayload,
  getJwtTokens
} from '@tuxsnct/workers-module-auth'
import { Handler } from 'worktop'
import { parse } from 'worktop/cookie'
import { KV, read, write } from 'worktop/kv'

// eslint-disable-next-line init-declarations, @typescript-eslint/no-unused-vars
declare let POSTS: KV.Namespace

// eslint-disable-next-line max-statements
export const handlePosts: Handler = async (request, response) => {
  let { code, data, headers }: ResponseItems = { code: 403, data: {}, headers: { 'content-type': 'application/json' } }
  const auth = request.headers.get('Authorization')
  const cookie = request.headers.get('Cookie')
  const postData = await read(POSTS, request.params.id)

  if (data) {
    if (request.method === 'GET') {
      code = 200
      data = { postData }
    } else if (
      request.method === 'POST' &&
      auth && cookie && checkCookieTokenExistence(cookie)
    ) {
      const payload = await getJwtPayload([auth, (parse(cookie) as CookieToken).token].join('.'))
      const tokens = payload && await getJwtTokens(payload)

      if (tokens) {
        await write(POSTS, request.params.id, await request.body.text())
        code = 200
        data = { token: tokens.csrfToken }
        headers['set-cookie'] = generateCookie({ name: 'token', value: tokens.cookieToken })
      }
    }
  }
  response.send(code, data, headers)
}
