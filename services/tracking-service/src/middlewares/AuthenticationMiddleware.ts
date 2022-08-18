import { NextFunction, Request, Response } from 'express'

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.error(
      {
        message: 'Unauthorized',
      },
      401
    )
  }

  next()
}
