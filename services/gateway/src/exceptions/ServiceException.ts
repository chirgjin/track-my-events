import { Request, Response } from 'express'

import BaseException from 'src/exceptions/BaseException'

/**
 * Base exception class from which all exceptions will be inherited
 */
export default class ServiceException extends BaseException {
  constructor(public errors: Record<any, any> | string, status: number) {
    super(JSON.stringify(errors), status)

    if (typeof errors === 'string') {
      this.errors = {
        message: errors,
      }
    }
  }

  /**
   * This is the method called to handle how exceptions are sent to client
   */
  public async handle(error: ServiceException, _req: Request, res: Response) {
    return res.error(error.errors, error.status)
  }
}
