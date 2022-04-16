import { Router } from 'worktop'
import * as Cache from 'worktop/cache'

const router = new Router()

// eslint-disable-next-line max-statements
router.add('GET', '/*', async (request, response) => {
  const image = await fetch(`https://res.cloudinary.com/tuxsnct/image${new URL(request.url).pathname}`)
  if (image.ok) {
    const blob = await image.blob()
    const headers = {
      'cache-control': 'public,max-age=14400',
      'content-length': blob.size.toString(),
      'content-type': blob.type
    }

    response.writeHead(200, headers)
    response.end(await blob.arrayBuffer())
    return
  }
  response.send(image.status, image.statusText)
})

// eslint-disable-next-line @typescript-eslint/unbound-method
Cache.listen(router.run)
