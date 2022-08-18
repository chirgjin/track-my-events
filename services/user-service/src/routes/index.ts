import { Router } from 'src/helpers'
import { router as v1Router } from 'src/routes/v1'

export const router = new Router()

router.get('/health/', 'HealthController.index')

router.mount('/v1/', v1Router)
