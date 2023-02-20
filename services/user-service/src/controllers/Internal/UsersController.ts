import { User } from '@prisma/client'
import { Request, Response } from 'express'

import { prisma } from 'src/prismaClient'
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

    let where: Partial<User> = {}

    if (body.id) {
      where.id = body.id
    } else {
      where.apiKey = body.apiKey
    }

    const user = await prisma.user.findFirst({
      where,
    })

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
