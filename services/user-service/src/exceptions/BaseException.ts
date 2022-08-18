import { Exception } from '@poppinss/utils'
import { Request, Response } from 'express'

/**
 * Base exception class from which all exceptions will be inherited
 */
export default class BaseException extends Exception {
  /**
   * This is the method called to handle how exceptions are sent to client
   */
  public async handle(error: BaseException, _req: Request, res: Response) {
    return res.status(error.status).json({
      errors: {
        message: error.message,
      },
    })
  }
}
