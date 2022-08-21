import { Router } from 'src/helpers'
import AuthenticationMiddleware from 'src/middlewares/AuthenticationMiddleware'

export const router = new Router()

router.post('/users/', 'Public/UsersController.create')
router
  .get('/users/me/', 'Public/UsersController.me')
  .middleware(AuthenticationMiddleware)
router
  .put('/users/me/', 'Public/UsersController.update')
  .middleware(AuthenticationMiddleware)

router.post('/auth/login/', 'Public/AuthenticationController.login')
router.post(
  '/auth/refresh-token/',
  'Public/AuthenticationController.refreshToken'
)
