import { parse, stringify } from 'worktop/cookie'

export type Cookie = {
  name: string,
  value: string
}

export type CookieToken = {
  token: string
}

export type CookieSerializeOptions = Parameters<typeof stringify>['2']

export const defaultSerializeOptions: CookieSerializeOptions = {
  domain: 'tuxsnct.com',
  httponly: true,
  maxage: 7 * 24 * 60 * 60,
  path: '/',
  samesite: 'Strict',
  secure: true
}

export const generateCookie = (
  cookie: Cookie,
  serializeOptions?: CookieSerializeOptions
) => stringify(cookie.name, cookie.value, serializeOptions || defaultSerializeOptions)

export const checkCookieTokenExistence = (cookie: string) => Boolean(parse(cookie).token)
