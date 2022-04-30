import { CookieSerializeOptions } from '@tuxsnct/workers-module-auth'

export const defaultSerializeOptions: CookieSerializeOptions = {
  domain: 'api.tuxsnct.com',
  httponly: true,
  maxage: 7 * 24 * 60 * 60,
  path: '/',
  samesite: 'Strict',
  secure: true
}
