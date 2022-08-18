import { Router } from 'src/helpers'

export const router = new Router()

router.get('/users/find/', 'Internal/UsersController.find')
