/* eslint-disable sonarjs/no-duplicate-string */

import {
  checkCookieTokenExistence,
  CookieToken,
  generateCookie,
  getJwtPayload,
  getJwtTokens,
  User
} from '@tuxsnct/workers-module-auth'
import { Router } from 'worktop'
import * as Cache from 'worktop/cache'
import { parse } from 'worktop/cookie'
import { KV, read } from 'worktop/kv'

/* eslint-disable init-declarations, @typescript-eslint/no-unused-vars */
declare let BLOG: R2Bucket
declare let USERS: KV.Namespace
/* eslint-enable init-declarations, @typescript-eslint/no-unused-vars */

const detectBucket = (bucket: string) => {
  if (bucket === 'blog') return BLOG
  throw new Error(`bucket ${bucket} does not exist`)
}

const router = new Router()

router.add('GET', '/:bucket/:key', async (request, response) => {
  try {
    const bucket = detectBucket(request.params.bucket)
    const object = await bucket.get(request.params.key)

    if (object) {
      object.writeHttpMetadata(response.headers)
      response.headers.set('etag', object.etag)
      response.end(object.body)
      return
    }
    throw new Error(`resource ${request.params.key} does not exist`)
  } catch (error) {
    response.send(404, `404: ${(error as Error).message}`)
  }
})

// eslint-disable-next-line max-statements
router.add('POST', '/:bucket/:key', async (request, response) => {
  try {
    const auth = request.headers.get('Authorization')
    const cookie = request.headers.get('Cookie')
    const bucket = detectBucket(request.params.bucket)

    const blob = await request.body.blob()

    if (auth && cookie && checkCookieTokenExistence(cookie)) {
      const payload = await getJwtPayload([auth, (parse(cookie) as CookieToken).token].join('.'))
      const tokens = payload && await getJwtTokens(payload)
      const user = payload?.email && await read(USERS, payload?.email) as User

      if (user && user.admin && tokens) {
        const headers = new Headers()
        headers.set('content-type', blob.type)
        await bucket.put(request.params.key, await blob.arrayBuffer(), { httpMetadata: headers })
        // eslint-disable-next-line max-len
        response.send(200, { token: tokens.csrfToken }, { 'content-type': 'application/json', 'set-cookie': generateCookie({ name: 'token', value: tokens.cookieToken }) })
        return
      }

      throw new Error('authentication error')
    }
  } catch (error) {
    response.send(403, `403: ${(error as Error).message}`)
  }
})

router.add('GET', '/status', (_request, response) => {
  response.send(200)
})

// eslint-disable-next-line unicorn/prefer-add-event-listener
router.onerror = (_request, _response, status) => {
  if (status === 404) return new Response('not found', { status })
  return new Response('something went wrong', { status })
}

// eslint-disable-next-line @typescript-eslint/unbound-method
Cache.listen(router.run)

/* eslint-enable sonarjs/no-duplicate-string */
