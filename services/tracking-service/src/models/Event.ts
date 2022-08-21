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
  public userId: string // id of user where the tracking is being done. If user doesnt exist then a temp id is generated
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

export const eventSchema = new Schema(
  Event,
  {
    internalUserId: {
      type: 'string',
    },

    sessionId: {
      type: 'string',
      sortable: true,
    },
    eventTime: {
      type: 'date',
      sortable: true,
    },
    eventName: {
      type: 'string',
      sortable: true,
    },
    page: {
      type: 'string',
      sortable: true,
    },
    referrer: {
      type: 'string',
    },
    _context: {
      type: 'string',
    },
    userId: {
      type: 'string',
      sortable: true,
    },
    userAgent: {
      type: 'string',
    },

    createdAt: {
      type: 'date',
    },
  },
  {
    dataStructure: 'HASH',
  }
)

export const eventRepository = omClient.fetchRepository(eventSchema)
