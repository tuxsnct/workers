import { Validator, Schema } from '@cfworker/json-schema'
import { getJwtTokens, generateCookie, generateSecret, User } from '@tuxsnct/workers-module-auth'
import { Handler } from 'worktop'
import { KV, read, write } from 'worktop/kv'
import { uid } from 'worktop/utils'

// eslint-disable-next-line init-declarations
declare let USERS: KV.Namespace

const schemaRegister: Schema = {
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  type: 'object'
}

// eslint-disable-next-line max-statements
export const handleRegister: Handler = async (request, response) => {
  let { code, data, headers }: ResponseItems = { code: 401, data: {}, headers: { 'content-type': 'application/json' } }
  const body = await request.body.json<User>()

  if (new Validator(schemaRegister).validate(body)) {
    const user = body
    user.id = uid()
    const secret = generateSecret()
    user.secret = secret

    if (!(await read(USERS, user.email)) && await write(USERS, user.email, JSON.stringify(user))) {
      const tokens = await getJwtTokens(user)

      if (tokens) {
        code = 200
        data = { secret, token: tokens.csrfToken }
        headers['set-cookie'] = generateCookie({ name: 'token', value: tokens.cookieToken })
      }
    }
  }

  response.send(code, data, headers)
}
