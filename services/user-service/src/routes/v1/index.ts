import { Router } from 'src/helpers'
import { router as InternalRouter } from 'src/routes/v1/internal'
import { router as PublicRouter } from 'src/routes/v1/public'

export const router = new Router()

router.mount('/public/', PublicRouter)
router.mount('/internal/', InternalRouter)
