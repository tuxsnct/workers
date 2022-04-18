import { Credential, getJwtTokens, generateCookie, totp, User } from '@tuxsnct/workers-module-auth'
import { Handler } from 'worktop'
import { KV, read } from 'worktop/kv'

// eslint-disable-next-line init-declarations
declare let USERS: KV.Namespace

// eslint-disable-next-line max-statements
export const handleLogin: Handler = async (request, response) => {
  let { code, data, headers }: ResponseItems = { code: 401, data: {}, headers: { 'content-type': 'application/json' } }
  const { email, otp, password } = await request.body() as Credential

  const user = await read(USERS, email) as User

  if (user) {
    const totpArray = [
      await totp(user.secret, 6, -30),
      await totp(user.secret, 6),
      await totp(user.secret, 6, 30)
    ]

    if (user.email === email && user.password === password && totpArray.includes(otp)) {
      const jwtTokens = await getJwtTokens(user)

      if (jwtTokens) {
        code = 200
        data = { token: jwtTokens.csrfToken }
        headers['set-cookie'] = generateCookie({ name: 'token', value: jwtTokens.cookieToken })
      }
    }
  }
  response.send(code, data, headers)
}
