import { Request, Response } from 'express'

import BaseException from 'src/exceptions/BaseException'

/**
 * Exception class for exceptions thrown by validate function
 */
export default class ValidatorException extends BaseException {
  constructor(public errors: any, statusCode: number = 400) {
    super(JSON.stringify(errors), statusCode)
    this.name = 'ValidatorException'
  }

  /**
   * Handle method to handle error reporting
   */
  public async handle(error: ValidatorException, _req: Request, res: Response) {
    return res.error(error.errors, this.status)
  }
}
