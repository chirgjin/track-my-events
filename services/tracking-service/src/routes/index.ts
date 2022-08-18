import { Router } from 'src/helpers'
import { router as v1PublicRouter } from 'src/routes/v1/public'

export const router = new Router()

router.get('/health/', 'HealthController.index')

router.mount('/v1/public/', v1PublicRouter)
