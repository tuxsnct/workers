import { parse, stringify } from 'worktop/cookie'
import { ServerResponse } from 'worktop/response'

export type Cookie = {
  name: string,
  value: string
}

export type CookieToken = {
  token: string
}

export type CookieSerializeOptions = Parameters<typeof stringify>['2']

export const setCookie = (response: ServerResponse, cookie: Cookie, serializeOptions?: CookieSerializeOptions) => {
  response.setHeader(
    'Set-Cookie',
    stringify(
      cookie.name,
      cookie.value,
      {
        ...serializeOptions,
        // domain: 'api.tuxsnct.com',
        // httpOnly: true,
        maxage: 7 * 24 * 60 * 60,
        path: '/'
        // sameSite: 'strict',
        // secure: true
      }
    )
  )
}

export const checkCookieTokenExistence = (cookie: string) => Boolean(parse(cookie).token)
