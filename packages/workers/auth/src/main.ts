import * as Cache from 'worktop/cache'
import { router } from './router'

// eslint-disable-next-line @typescript-eslint/unbound-method
Cache.listen(router.run)
