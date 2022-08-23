import { config } from 'dotenv'
import { cleanEnv, port, str, url } from 'envalid'
import { resolve } from 'path'

config()

const validateEnv = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),

  REDIS_PUBSUB_URI: str(),

  REDIS_OM_URI: str(),

  USER_SERVICE_URL: url(),
})

export const {
  NODE_ENV,
  PORT,
  REDIS_PUBSUB_URI,
  REDIS_OM_URI,
  USER_SERVICE_URL,
} = validateEnv
export const APP_ROOT = resolve(__dirname, '..')
