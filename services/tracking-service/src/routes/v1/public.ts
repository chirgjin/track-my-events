import { Router } from 'src/helpers'
import AuthenticationMiddleware from 'src/middlewares/AuthenticationMiddleware'

export const router = new Router()

router.post('/events/', 'Public/EventsController.create')
router
  .get('/events/overview/', 'Public/EventsController.overview')
  .middleware(AuthenticationMiddleware)
router
  .get('/events/dau/', 'Public/EventsController.dailyActiveUsers')
  .middleware(AuthenticationMiddleware)
router
  .get('/events/', 'Public/EventsController.list')
  .middleware(AuthenticationMiddleware)
