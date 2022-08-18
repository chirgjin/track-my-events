import { Entity, Schema } from 'redis-om'

import { omClient } from 'src/redisClient'

export class Event extends Entity {
  public internalUserId: string // id of our internal user

  public sessionId: string
  public eventTime: Date
  public eventName: string
  public page: string
  public referrer: string | null
  public _context: string // redisJSON doesn't support objects, so we store context in string form
  public userId: string | null // id of user where the tracking is being done
  public userAgent: string | null
  public createdAt: Date

  private $context: Record<any, any>

  public get context() {
    if (!this.$context) {
      this.$context = JSON.parse(this._context)
    }

    return this.$context
  }

  public set context(value: Record<any, any>) {
    this.$context = value
    this._context = JSON.stringify(value)
  }
}

export const eventSchema = new Schema(Event, {
  internalUserId: {
    type: 'string',
  },

  sessionId: {
    type: 'string',
  },
  eventTime: {
    type: 'date',
  },
  eventName: {
    type: 'string',
  },
  page: {
    type: 'string',
  },
  referrer: {
    type: 'string',
  },
  _context: {
    type: 'string',
  },
  userId: {
    type: 'string',
  },
  userAgent: {
    type: 'string',
  },

  createdAt: {
    type: 'date',
  },
})

export const eventRepository = omClient.fetchRepository(eventSchema)
