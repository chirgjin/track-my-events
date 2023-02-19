import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'

import { EventData } from 'src/helpers/types'
import { prisma } from 'src/prismaClient'
import { pubsubClient } from 'src/redisClient'
import { NumberField, ObjectField, StringField, validate } from 'src/validator'

export default class {
  public async create(req: Request, res: Response) {
    const body = await validate(req.body, {
      apiKey: new StringField({}),
      sessionId: new StringField({}),
      userId: new StringField({}),
      eventTime: new NumberField({}), // timestamp in milliseconds
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
          thisMonth: await prisma.event.count({
            where: {
              internalUserId: user.id,
              eventTime: {
                gte: monthStart,
                lt: tomorrow,
              },
            },
          }),
          today: await prisma.event.count({
            where: {
              internalUserId: user.id,
              eventTime: {
                gte: today,
                lt: tomorrow,
              },
            },
          }),
        },
        activeUsers: {
          // TODO: use raw query or an alternative solution here
          // currently we have to use this hack because prisma doesn't support COUNT(DISTINCT)
          today: (
            await prisma.event.groupBy({
              by: ['userId'],
              where: {
                internalUserId: user.id,
                eventTime: {
                  gte: today,
                  lt: tomorrow,
                },
              },
            })
          ).length,
          thisMonth: (
            await prisma.event.groupBy({
              by: ['userId'],
              where: {
                internalUserId: user.id,
                eventTime: {
                  gte: monthStart,
                  lt: tomorrow,
                },
              },
            })
          ).length,
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
      await prisma.$queryRaw<{ day: Date; sessions: bigint; users: bigint }[]>(
        Prisma.sql`SELECT
        COUNT(DISTINCT "sessionId") as sessions, "eventTime"::date as day, COUNT(DISTINCT "userId") as users 
        FROM "Event"
        WHERE "eventTime" >= ${
          dates[dates.length - 1]
        } and "eventTime" < ${new Date(
          dates[0].getTime() + 8.64e7
        )} and "internalUserId" = ${user.id}::uuid GROUP BY "eventTime"::date`
      )
    ).reduce((acc, obj) => {
      const day = `${obj.day.getDate()}-${
        obj.day.getMonth() + 1
      }-${obj.day.getFullYear()}`

      acc[day] = {
        day,
        sessions: obj.sessions.toString(),
        users: obj.users.toString(),
      }

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

    const data = await prisma.$queryRawUnsafe<
      { eventName?: string; page?: string; sessions: bigint; users: bigint }[]
    >(
      `SELECT
        COUNT(DISTINCT "sessionId") as sessions, COUNT(DISTINCT "userId") as users, "${groupBy}"
        FROM "Event"
        WHERE "internalUserId" = $1::uuid
        GROUP BY "${groupBy}"`,
      user.id
    )

    return res.success(
      data.map((obj) => ({
        ...obj,
        sessions: String(obj.sessions),
        users: String(obj.users),
      })),
      200
    )
  }
}
