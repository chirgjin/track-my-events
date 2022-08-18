import { config } from 'dotenv'
import { cleanEnv, port, str, num, url } from 'envalid'
import { resolve } from 'path'

config()

const validateEnv = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),

  REDIS_PUBSUB_HOST: str(),
  REDIS_PUBSUB_PORT: port(),
  REDIS_PUBSUB_DB: num({
    default: 0,
  }),

  REDIS_OM_HOST: str(),
  REDIS_OM_PORT: port(),
  REDIS_OM_DB: num({
    default: 0,
  }),

  USER_SERVICE_URL: url(),
})

export const {
  NODE_ENV,
  PORT,
  REDIS_PUBSUB_HOST,
  REDIS_PUBSUB_PORT,
  REDIS_PUBSUB_DB,
  REDIS_OM_HOST,
  REDIS_OM_PORT,
  REDIS_OM_DB,
  USER_SERVICE_URL,
} = validateEnv
export const APP_ROOT = resolve(__dirname, '..')
