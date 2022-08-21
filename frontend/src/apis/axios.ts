import auth from 'src/helpers/auth'

import axiosStatic from 'axios'
import { refreshToken } from './auth'

export const axios = axiosStatic.create({
  baseURL: process.env.REACT_APP_API_URL,
})

axios.interceptors.request.use(async (config) => {
  if (loading && !config.url?.match(/refresh-token\/$/)) {
    // if the access token is being refreshed then don't make the API call yet.
    // wait for the loading to be resolved by generating a promise and pushing
    // the resolve function to list of pending requests.
    // When token is refreshed, every callback in pending request array will be
    // called.
    let _resolve: () => void

    let promise = new Promise<void>((resolve) => {
      _resolve = resolve
    })
    pendingRequests.push(_resolve!)

    await promise
  }

  if (auth.accessToken) {
    config.headers = config.headers || {}

    config.headers!.authorization = `Bearer ${auth.accessToken}`
  }

  return config
})

const pendingRequests: (() => void)[] = []
let loading = false

axios.interceptors.response.use(undefined, async (error) => {
  if (!isAxiosError(error) || error.response?.status !== 401) {
    throw error
  } else if (!auth.refreshToken) {
    // if refresh token doesn't exist then logout the user & reload page
    auth.update(null)
    return window.location.reload()
  }

  if (loading) {
    // add api call to queue
    return await axios(error.response.config)
  }

  // refresh token and re-send the api call
  loading = true

  await refreshToken({
    refreshToken: auth.refreshToken!,
  })

  loading = false
  pendingRequests.forEach((cb) => cb()) // resolve all promises

  return await axios(error.response.config)
})

export const { isAxiosError } = axiosStatic

export type ErrorResponse = {
  data?: null
  errors: Record<string, any>
}
