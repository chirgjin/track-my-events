import { Client, Repository } from 'redis-om'

import { REDIS_HOST, REDIS_PORT, REDIS_DB } from 'src/config'

export const client = new Client()

client.open(`redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`)

export async function createIndexes() {
  const repositories = await import('src/models')

  for (const repository of Object.values(repositories)) {
    if (repository instanceof Repository) {
      await repository.createIndex()
    }
  }
}
