import { createClient } from '@redis/client'
import { Client, Repository } from 'redis-om'

import { REDIS_OM_URI, REDIS_PUBSUB_URI } from 'src/config'

/****** Pub/Sub Client configuration  ******/
export const pubsubClient = createClient({
  url: REDIS_PUBSUB_URI,
})
pubsubClient.on('error', (err) => console.error('Redis Client Error', err))

/****** Redis OM client configuration ******/
export const omClient = new Client()

omClient.open(REDIS_OM_URI)

export async function createIndexes() {
  const repositories = await import('src/models')

  for (const repository of Object.values(repositories)) {
    if (repository instanceof Repository) {
      await repository.createIndex()
    }
  }
}
