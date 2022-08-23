import { Client, Repository } from 'redis-om'

import { REDIS_URI } from 'src/config'

export const client = new Client()

client.open(REDIS_URI)

export async function createIndexes() {
  const repositories = await import('src/models')

  for (const repository of Object.values(repositories)) {
    if (repository instanceof Repository) {
      await repository.createIndex()
    }
  }
}
