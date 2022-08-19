import { Router } from 'src/helpers'
import { router as serviceRouter } from 'src/routes/services'

export const router = new Router()

router.get('/health/', 'HealthController.index')
router.mount('/api/', serviceRouter)
