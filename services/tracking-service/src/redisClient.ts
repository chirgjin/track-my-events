import { createClient } from '@redis/client'

import {
  REDIS_PUBSUB_DB,
  REDIS_PUBSUB_HOST,
  REDIS_PUBSUB_PORT,
} from 'src/config'

export const pubsubClient = createClient({
  url: `redis://${REDIS_PUBSUB_HOST}:${REDIS_PUBSUB_PORT}/${REDIS_PUBSUB_DB}`,
})
pubsubClient.on('error', (err) => console.error('Redis Client Error', err))
