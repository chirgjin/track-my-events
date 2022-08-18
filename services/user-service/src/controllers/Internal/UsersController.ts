import { Request, Response } from 'express'

import { User, userRepository } from 'src/models'
import { StringField, validate } from 'src/validator'

export default class {
  public async find(req: Request, res: Response) {
    const body = await validate(req.query, {
      apiKey: new StringField({ required: false }),
      id: new StringField({ required: false }),
    })

    if (!body.apiKey && !body.id) {
      return res.error(
        {
          message: 'You must provide either API key or id',
        },
        400
      )
    }

    let user: User | null

    if (body.id) {
      user = await userRepository.fetch(body.id)

      if (!user.email) {
        user = null
      }
    } else {
      user = await userRepository
        .search()
        .where('apiKey')
        .equals(body.apiKey!)
        .first()
    }

    if (!user) {
      return res.error(
        {
          message: 'No Result found',
        },
        404
      )
    }

    return res.success(user, 200)
  }
}
