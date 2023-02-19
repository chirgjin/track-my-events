import { createClient } from '@redis/client'

import { REDIS_PUBSUB_URI } from 'src/config'

/****** Pub/Sub Client configuration  ******/
export const pubsubClient = createClient({
  url: REDIS_PUBSUB_URI,
})
pubsubClient.on('error', (err) => console.error('Redis Client Error', err))
