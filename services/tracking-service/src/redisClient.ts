import { createClient } from '@redis/client'
import { Client, Repository } from 'redis-om'

import {
  REDIS_OM_DB,
  REDIS_OM_HOST,
  REDIS_OM_PORT,
  REDIS_PUBSUB_DB,
  REDIS_PUBSUB_HOST,
  REDIS_PUBSUB_PORT,
} from 'src/config'

/****** Pub/Sub Client configuration  ******/
export const pubsubClient = createClient({
  url: `redis://${REDIS_PUBSUB_HOST}:${REDIS_PUBSUB_PORT}/${REDIS_PUBSUB_DB}`,
})
pubsubClient.on('error', (err) => console.error('Redis Client Error', err))

/****** Redis OM client configuration ******/
export const omClient = new Client()

omClient.open(`redis://${REDIS_OM_HOST}:${REDIS_OM_PORT}/${REDIS_OM_DB}`)

export async function createIndexes() {
  const repositories = await import('src/models')

  for (const repository of Object.values(repositories)) {
    if (repository instanceof Repository) {
      await repository.createIndex()
    }
  }
}
