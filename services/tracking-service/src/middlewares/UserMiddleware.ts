import { NextFunction, Request, Response } from 'express'

import { User } from 'src/helpers/types'

export default function (req: Request, _res: Response, next: NextFunction) {
  let user: User | undefined

  if (typeof req.headers.user === 'string') {
    try {
      user = JSON.parse(req.headers.user)

      if (
        ['id', 'name', 'email', 'apiKey', 'createdAt', 'updatedAt'].filter(
          (key) => !(key in user!)
        ).length > 0
      ) {
        user = undefined
      }
    } catch (e) {
      user = undefined
    }
  }

  req.user = user

  next()
}
