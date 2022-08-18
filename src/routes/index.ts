import { Router } from 'src/helpers'

export const router = new Router()

router.get('/health/', 'HealthController.index')
