import { User, getJwtTokens, setCookie } from '@tuxsnct/workers-module-auth'
import { nanoid } from 'nanoid'
import { Handler } from 'worktop'
import { KV, read, write } from 'worktop/kv'

// eslint-disable-next-line init-declarations
declare let USERS: KV.Namespace

// eslint-disable-next-line max-statements
export const handleRegister: Handler = async (request, response) => {
  const user = await request.body() as User
  user.id = nanoid()
  user.admin = false

  response.setHeader('Content-Type', 'application/json')

  if (!(await read(USERS, user.email)) && await write(USERS, user.email, JSON.stringify(user))) {
    delete user.password
    const jwtTokens = await getJwtTokens(user)

    if (jwtTokens) {
      setCookie(response, { name: 'token', value: jwtTokens.cookieToken })
      response.send(200, { token: jwtTokens.csrfToken })
      return
    }
  }
  response.send(401, {})
}
