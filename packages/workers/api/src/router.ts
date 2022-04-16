import { Router } from 'worktop'
import { handleGraphQLRequest, handleLogin, handleRegister, handleToken } from './handlers'

export const router = new Router()

router.add('POST', '/graphql', handleGraphQLRequest)
router.add('POST', '/auth/login', handleLogin)
router.add('POST', '/auth/register', handleRegister)
router.add('POST', '/auth/token', handleToken)
