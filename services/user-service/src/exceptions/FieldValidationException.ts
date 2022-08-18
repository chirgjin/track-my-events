import { Request, Response } from 'express'

import BaseException from 'src/exceptions/BaseException'

/**
 * Exception class for exceptions thrown by field validations
 */
export default class FieldValidationException extends BaseException {
  constructor(public error: string, statusCode: number = 400) {
    super(error, statusCode)
    this.name = 'FieldValidationException'
  }

  /**
   * Handle method to handle error reporting
   */
  public async handle(
    error: FieldValidationException,
    _req: Request,
    res: Response
  ) {
    return res.error(
      {
        message: error.error,
      },
      this.status
    )
  }
}
