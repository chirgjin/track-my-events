import { config } from 'dotenv'
import { cleanEnv, port, str } from 'envalid'
import { resolve } from 'path'

config()

const validateEnv = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),

  REDIS_URI: str(),
})

export const { NODE_ENV, PORT, REDIS_URI } = validateEnv
export const APP_ROOT = resolve(__dirname, '..')
