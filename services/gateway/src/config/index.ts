import { config } from 'dotenv'
import { cleanEnv, port, str, url } from 'envalid'
import { resolve } from 'path'

config()

const validateEnv = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),

  USER_SERVICE_URL: url(),
  TRACKING_SERVICE_URL: url(),
})

export const { NODE_ENV, PORT, USER_SERVICE_URL, TRACKING_SERVICE_URL } =
  validateEnv
export const APP_ROOT = resolve(__dirname, '..')
