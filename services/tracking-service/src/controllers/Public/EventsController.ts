import { Request, Response } from 'express'

import { EventData } from 'src/helpers/types'
import { pubsubClient } from 'src/redisClient'
import { NumberField, ObjectField, StringField, validate } from 'src/validator'

export default class {
  public async create(req: Request, res: Response) {
    const body = await validate(req.body, {
      apiKey: new StringField({}),
      sessionId: new StringField({}),
      userId: new StringField({ required: false, allowNull: true }),
      eventTime: new NumberField({}), // timestamp in epoch
      eventName: new StringField({}),
      page: new StringField({}),
      referrer: new StringField({ required: false, allowNull: true }),
      context: new ObjectField({}),
    })

    const data: EventData = {
      ...body,
      userAgent: req.headers['user-agent'] || null,
    }

    await pubsubClient.publish('events', JSON.stringify(data))

    return res.success({}, 201)
  }
}
