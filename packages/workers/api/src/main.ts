import { compose } from 'worktop'
import * as Cache from 'worktop/cache'
import { preflight } from 'worktop/cors'
import { router } from './router'

router.prepare = compose(
  preflight({
    credentials: true,
    headers: ['Cache-Control', 'Content-Type'],
    origin: true
  })
)

// eslint-disable-next-line @typescript-eslint/unbound-method
Cache.listen(router.run)
