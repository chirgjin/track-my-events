import { NextFunction, Request, Response } from 'express'

/**
 * Middleware which adds helpers functions to response.
 */
export default function (_req: Request, res: Response, next: NextFunction) {
  res.sendResponse = function (data: Record<any, any>) {
    return res.json(data)
  }

  res.success = function (data: any, status: number) {
    const obj: Record<string, any> = {
      data,
      errors: null,
    }

    return res.status(status).sendResponse(obj)
  }

  res.error = function (errors: any, status: number) {
    return res.status(status).sendResponse({
      data: null,
      errors,
    })
  }

  next()
}
