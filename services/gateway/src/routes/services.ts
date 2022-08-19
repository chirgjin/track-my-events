import { Router } from 'src/helpers'

export const router = new Router()

router.use('*', 'ServiceController.handle')
