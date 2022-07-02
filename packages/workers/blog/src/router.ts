import { Router } from 'worktop'
import { handlePosts, handleStatus } from './handlers'

export const router = new Router()

router.add('GET', '/blog/posts/:id', handlePosts)
router.add('POST', '/blog/posts/:id', handlePosts)
router.add('GET', '/blog/status', handleStatus)
