import { parse, stringify } from 'worktop/cookie'

export type Cookie = {
  name: string,
  value: string
}

export type CookieToken = {
  token: string
}

export type CookieSerializeOptions = Parameters<typeof stringify>['2']

export const generateCookie = (
  cookie: Cookie,
  serializeOptions?: CookieSerializeOptions
) => stringify(cookie.name, cookie.value, serializeOptions)

export const checkCookieTokenExistence = (cookie: string) => Boolean(parse(cookie).token)
