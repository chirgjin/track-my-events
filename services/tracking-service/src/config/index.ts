import { config } from 'dotenv'
import { cleanEnv, port, str, num } from 'envalid'
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
} = validateEnv
export const APP_ROOT = resolve(__dirname, '..')
