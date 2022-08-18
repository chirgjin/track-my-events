import { Client } from 'redis-om'
import { REDIS_HOST, REDIS_PORT, REDIS_DB } from 'src/config'

export const client = new Client()

client.open(`redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`)
