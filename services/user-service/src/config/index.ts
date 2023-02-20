import { config } from 'dotenv'
import { cleanEnv, port, str } from 'envalid'
import { resolve } from 'path'

config()

const validateEnv = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),

  DATABASE_URL: str(),
})

export const { NODE_ENV, PORT, DATABASE_URL } = validateEnv
export const APP_ROOT = resolve(__dirname, '..')
