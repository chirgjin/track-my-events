/* eslint-disable no-unused-vars */

/**
 * This file contains declaration merging for express
 */
import * as core from 'express-serve-static-core'

import { User } from 'src/helpers/types'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
  interface Response {
    sendResponse(data: Record<any, any>): Response
    success(data: any, status: number): Response
    error(errors: any, status: number): Response
  }
}
