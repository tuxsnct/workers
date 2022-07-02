import { Router } from 'worktop'
import { handleLogin, handleRegister, handleStatus, handleToken } from './handlers'

export const router = new Router()

router.add('POST', '/auth/login', handleLogin)
router.add('POST', '/auth/register', handleRegister)
router.add('GET', '/auth/status', handleStatus)
router.add('POST', '/auth/token', handleToken)
