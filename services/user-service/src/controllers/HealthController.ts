import { Request, Response } from 'express'

class HealthController {
  /**
   * API which indicates the server is up & able to serve requests
   */
  public index(_req: Request, res: Response) {
    return res.send('OK')
  }
}

export default HealthController
