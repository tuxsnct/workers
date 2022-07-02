import { Validator, Schema } from '@cfworker/json-schema'
import { Credential, getJwtTokens, generateCookie, totp, User } from '@tuxsnct/workers-module-auth'
import { Handler } from 'worktop'
import { KV, read } from 'worktop/kv'

// eslint-disable-next-line init-declarations
declare let USERS: KV.Namespace

const schemaLogin: Schema = {
  properties: {
    email: { type: 'string' },
    otp: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'otp', 'password'],
  type: 'object'
}

// eslint-disable-next-line max-statements
export const handleLogin: Handler = async (request, response) => {
  let { code, data, headers }: ResponseItems = { code: 401, data: {}, headers: { 'content-type': 'application/json' } }
  const body = await request.body.json<Credential>()

  if (new Validator(schemaLogin).validate(body)) {
    const { email, otp, password } = body

    const user = await read(USERS, email) as User

    if (user) {
      const totpArray = [
        await totp(user.secret, 6, -30),
        await totp(user.secret, 6),
        await totp(user.secret, 6, 30)
      ]

      if (user.email === email && user.password === password && totpArray.includes(otp)) {
        const tokens = await getJwtTokens(user)

        if (tokens) {
          code = 200
          data = { token: tokens.csrfToken }
          headers['set-cookie'] = generateCookie({ name: 'token', value: tokens.cookieToken })
        }
      }
    }
  }

  response.send(code, data, headers)
}
