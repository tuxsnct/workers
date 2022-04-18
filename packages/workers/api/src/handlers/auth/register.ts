import { User, getJwtTokens, generateCookie, generateSecret } from '@tuxsnct/workers-module-auth'
import { Handler } from 'worktop'
import { KV, read, write } from 'worktop/kv'
import { uid } from 'worktop/utils'

// eslint-disable-next-line init-declarations
declare let USERS: KV.Namespace

// eslint-disable-next-line max-statements
export const handleRegister: Handler = async (request, response) => {
  let { code, data, headers }: ResponseItems = { code: 401, data: {}, headers: { 'content-type': 'application/json' } }

  const user = await request.body() as User
  user.id = uid()
  const secret = generateSecret().toUpperCase()
  user.secret = secret

  if (!(await read(USERS, user.email)) && await write(USERS, user.email, JSON.stringify(user))) {
    const jwtTokens = await getJwtTokens(user)

    if (jwtTokens) {
      code = 200
      data = { secret, token: jwtTokens.csrfToken }
      headers['set-cookie'] = generateCookie({ name: 'token', value: jwtTokens.cookieToken })
    }
  }
  response.send(code, data, headers)
}
