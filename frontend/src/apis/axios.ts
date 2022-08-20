import auth from 'src/helpers/auth'

import axiosStatic from 'axios'

export const axios = axiosStatic.create({
  baseURL: process.env.REACT_APP_API_URL,
})

axios.interceptors.request.use((config) => {
  if (auth.accessToken) {
    config.headers = config.headers || {}

    config.headers!.authorization = `Bearer ${auth.accessToken}`
  }

  return config
})

export const { isAxiosError } = axiosStatic

export type ErrorResponse = {
  data?: null
  errors: Record<string, any>
}
