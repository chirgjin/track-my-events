import { Request, Response } from 'express'

import BaseException from 'src/exceptions/BaseException'

/**
 * Base exception class from which all exceptions will be inherited
 */
export default class BadRequestException extends BaseException {
  constructor(public errors: Record<any, any> | string) {
    super(JSON.stringify(errors), 400)

    if (typeof errors === 'string') {
      this.errors = {
        message: errors,
      }
    }
  }

  /**
   * This is the method called to handle how exceptions are sent to client
   */
  public async handle(
    error: BadRequestException,
    _req: Request,
    res: Response
  ) {
    return res.error(error.errors, error.status)
  }
}
