import { Request, Response } from 'express'

import { aggregate } from 'src/helpers'
import { EventData } from 'src/helpers/types'
import { eventRepository } from 'src/models'
import { pubsubClient } from 'src/redisClient'
import { NumberField, ObjectField, StringField, validate } from 'src/validator'

export default class {
  public async create(req: Request, res: Response) {
    const body = await validate(req.body, {
      apiKey: new StringField({}),
      sessionId: new StringField({}),
      userId: new StringField({}),
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

  public async overview(req: Request, res: Response) {
    const user = req.user!
    const today = new Date(new Date().toDateString())
    const tomorrow = new Date(today.getTime() + 8.64e7)

    const monthStart = new Date(today.getTime())
    monthStart.setDate(0)

    return res.success(
      {
        eventsRecorded: {
          thisMonth: await eventRepository
            .search()
            .where('internalUserId')
            .equals(user.entityId)
            .where('eventTime')
            .greaterThanOrEqualTo(monthStart)
            .where('eventTime')
            .lessThan(tomorrow)
            .count(),
          today: await eventRepository
            .search()
            .where('internalUserId')
            .equals(user.entityId)
            .where('eventTime')
            .greaterThanOrEqualTo(today)
            .where('eventTime')
            .lessThan(tomorrow)
            .count(),
        },
        activeUsers: {
          today:
            (
              await aggregate<{ count: string }>([
                `FT.AGGREGATE`,
                `Event:index`,
                `( ( (@internalUserId:{${user.entityId}}) (@eventTime:[${
                  today.getTime() / 1000
                } +inf]) ) (@eventTime:[-inf (${tomorrow.getTime() / 1000}]) )`,
                `GROUPBY`,
                0,
                `REDUCE`,
                `COUNT_DISTINCT`,
                `1`,
                `@userId`,
                `as`,
                `count`,
              ])
            ).pop()?.count ?? 0,
          thisMonth:
            (
              await aggregate<{ count: string }>([
                `FT.AGGREGATE`,
                `Event:index`,
                `( ( (@internalUserId:{${user.entityId}}) (@eventTime:[${
                  monthStart.getTime() / 1000
                } +inf]) ) (@eventTime:[-inf (${tomorrow.getTime() / 1000}]) )`,
                `GROUPBY`,
                0,
                `REDUCE`,
                `COUNT_DISTINCT`,
                `1`,
                `@userId`,
                `as`,
                `count`,
              ])
            ).pop()?.count ?? 0,
        },
      },
      200
    )
  }

  public async dailyActiveUsers(req: Request, res: Response) {
    const user = req.user!

    const numberOfDays = Math.max(parseInt(req.query.days as string), 0) || 30

    let previousDate = new Date(new Date().toDateString())

    const dates: Date[] = []

    while (dates.length < numberOfDays) {
      dates.push(previousDate)
      previousDate = new Date(previousDate.getTime() - 8.64e7)
    }

    const data = (
      await aggregate<{
        day: string
        sessions: string
        users: string
      }>([
        `FT.AGGREGATE`,
        `Event:index`,
        `( ( (@internalUserId:{${user.entityId}}) (@eventTime:[${
          dates[dates.length - 1].getTime() / 1000
        } +inf]) ) (@eventTime:[-inf (${
          (dates[0].getTime() + 8.64e7) / 1000
        }]) )`,
        `APPLY`,
        `timefmt(@eventTime, '%-d-%-m-%Y')`,
        `AS`,
        `day`,
        `GROUPBY`,
        1,
        `@day`,
        `REDUCE`,
        `COUNT_DISTINCT`,
        `1`,
        `@sessionId`,
        `as`,
        `sessions`,
        `REDUCE`,
        `COUNT_DISTINCT`,
        `1`,
        `@userId`,
        `as`,
        `users`,
      ])
    ).reduce((acc, obj) => {
      acc[obj.day] = obj

      return acc
    }, {} as Record<string, { day: string; sessions: string; users: string }>)

    return res.success(
      dates.map((date) => {
        const day = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`

        return (
          data[day] || {
            day,
            users: 0,
            sessions: 0,
          }
        )
      }),
      200
    )
  }

  public async list(req: Request, res: Response) {
    const user = req.user!

    const { groupBy } = await validate(req.query, {
      groupBy: new StringField({
        choices: ['eventName', 'page'],
      }),
    })

    const data = await aggregate<{
      day: string
      sessions: string
      users: string
    }>([
      `FT.AGGREGATE`,
      `Event:index`,
      `(@internalUserId:{${user.entityId}})`,
      `GROUPBY`,
      1,
      `@${groupBy}`,
      `REDUCE`,
      `COUNT_DISTINCT`,
      `1`,
      `@sessionId`,
      `as`,
      `sessions`,
      `REDUCE`,
      `COUNT_DISTINCT`,
      `1`,
      `@userId`,
      `as`,
      `users`,
      `REDUCE`,
      `COUNT`,
      0,
      `as`,
      `count`,
    ])

    return res.success(data, 200)
  }
}
