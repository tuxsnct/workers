import { Credential, getJwtTokens, setCookie, User } from '@tuxsnct/workers-module-auth'
import { Handler } from 'worktop'
import { KV, read } from 'worktop/kv'

// eslint-disable-next-line init-declarations
declare let USERS: KV.Namespace

// eslint-disable-next-line max-statements
export const handleLogin: Handler = async (request, response) => {
  const credential = await request.body() as Credential

  response.setHeader('Content-Type', 'application/json')

  if (credential) {
    const user = await read(USERS, credential.email) as User

    if (user && user.email === credential.email && user.password === credential.password) {
      delete user.password
      const jwtTokens = await getJwtTokens(user)

      if (jwtTokens) {
        setCookie(response, { name: 'token', value: jwtTokens.cookieToken })
        response.send(200, { token: jwtTokens.csrfToken })
        return
      }
    }
  }
  response.send(401, {})
}
