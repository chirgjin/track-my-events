import { Router } from 'src/helpers'

export const router = new Router()

router.post('/events/', 'Public/EventsController.create')
