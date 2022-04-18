import jwt from '@tsndr/cloudflare-worker-jwt'
import { User, userHiddenKeys, UserHiddenKeys } from './user'

// eslint-disable-next-line init-declarations
declare let SECRET_KEY: string

export type JwtPayload = PartiallyPartial<User, UserHiddenKeys> & {
  exp?: number
}

export const getRefreshedJwt = (jwtPayload: JwtPayload) => {
  jwtPayload.exp = Math.floor(Date.now() / 1000) + (60 * 60)
  return jwtPayload
}

export const validateAuthFormat = (auth: string) => {
  const splittedAuth = auth.split(' ')
  return splittedAuth.length === 2 && splittedAuth[0] === 'Bearer'
}

export const getAuthHeaderToken = (auth: string) => {
  const isAuthHeaderValid = validateAuthFormat(auth)
  const { 1: token } = auth.split(' ')
  if (isAuthHeaderValid) return token
  // eslint-disable-next-line unicorn/no-null
  return null
}

export const getJwtPayload = async (auth: string) => {
  const token = getAuthHeaderToken(auth)
  if (token && await jwt.verify(token, SECRET_KEY)) return jwt.decode(token) as JwtPayload
  // eslint-disable-next-line unicorn/no-null
  return null
}

const splitJwt = (token: string) => {
  const splittedJwt = token.split('.')

  if (splittedJwt.length === 3) {
    return {
      header: splittedJwt[0],
      payload: splittedJwt[1],
      signature: splittedJwt[2]
    }
  } else if (splittedJwt.length === 2) {
    return {
      header: splittedJwt[0],
      payload: splittedJwt[1]
    }
  }

  // eslint-disable-next-line unicorn/no-null
  return null
}

export const getJwtTokens = async (jwtPayload: JwtPayload, withCredential = false) => {
  if (!withCredential) {
    for (const key of userHiddenKeys) {
      // eslint-disable-next-line security/detect-object-injection
      delete jwtPayload[key]
    }
  }
  const splittedJwt = splitJwt(await jwt.sign(getRefreshedJwt(jwtPayload), SECRET_KEY, { algorithm: 'HS256' }))

  if (splittedJwt) {
    const { header, payload, signature } = splittedJwt

    if (signature) {
      return {
        cookieToken: signature,
        csrfToken: [header, payload].join('.')
      }
    }
  }

  // eslint-disable-next-line unicorn/no-null
  return null
}
