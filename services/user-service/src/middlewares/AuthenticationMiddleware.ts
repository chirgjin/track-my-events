import { NextFunction, Request, Response } from 'express'

import { verifyToken } from 'src/helpers/auth'

/**
 * Middleware which adds helpers functions to response.
 */
export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization

  if (!authorization || !authorization.match(/^bearer \S+/i)) {
    return res.error(
      {
        message: 'Unauthorized',
      },
      401
    )
  }

  const user = await verifyToken(authorization.match(/^bearer (\S+)/i)![1])

  if (!user) {
    return res.error(
      {
        message: 'Unauthorized',
      },
      401
    )
  }

  req.user = user

  next()
}
