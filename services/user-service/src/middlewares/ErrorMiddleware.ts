import { NextFunction, Request, Response } from 'express'

import BaseException from 'src/exceptions/BaseException'

/**
 * Middleware to handle errors.
 *
 * `_next` param is required because express works on basis
 * of number of arguments accepted by function and it will
 * only registers the middleware as error handler if it
 * accepts 4 arguments.
 */
export default function (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err) // TODO: Debug Check

  if (err instanceof BaseException) {
    return err.handle(err, req, res)
  }

  return res.error(
    {
      message: 'Internal Server Error',
    },
    500
  )
}
