import axios from 'axios'
import { Request, Response } from 'express'

import { USER_SERVICE_URL, TRACKING_SERVICE_URL } from 'src/config'
import { fetchUser } from 'src/helpers'

type ServiceConfig = {
  url: string
  handleAuth?: boolean
}

const excludedHeaders = new Set([
  'host',
  'connection',
  'content-length',
  'accept-encoding',
])

export default class {
  public readonly serviceConfig: Record<string, ServiceConfig> = {
    'user-service': {
      url: `${USER_SERVICE_URL.replace(/\/$/, '')}/`,
    },
    'tracking-service': {
      url: `${TRACKING_SERVICE_URL.replace(/\/$/, '')}/`,
      handleAuth: true,
    },
  }

  public async handle(req: Request, res: Response) {
    const parts = req.url.replace(/^\//, '').split('/')
    const basePath = parts.shift()
    const path = parts.join('/')

    if (!basePath || !this.serviceConfig[basePath]) {
      return res.status(404).send('Not Found')
    }

    const serviceConfig = this.serviceConfig[basePath]

    if (serviceConfig.handleAuth && req.headers.authorization) {
      const user = await fetchUser(req.headers.authorization)
      req.headers.user = JSON.stringify(user)
    }

    const response = await axios.request({
      headers: Object.keys(req.headers)
        .filter((key) => !excludedHeaders.has(key.toLowerCase()))
        .reduce((acc, key) => {
          acc[key] = req.header(key)

          return acc
        }, {}),
      params: req.query,
      data: req,
      method: req.method,
      url: `${serviceConfig.url}${path}`,
      responseType: 'stream',

      validateStatus: () => true, // every status is valid
    })

    Object.keys(response.headers).forEach((key) => {
      if (!excludedHeaders.has(key.toLowerCase())) {
        res.setHeader(key, response.headers[key])
      }
    })

    res.status(response.status)

    response.data.pipe(res)
  }
}
