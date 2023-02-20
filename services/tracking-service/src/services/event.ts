import { prisma } from 'src/prismaClient'

export async function createEvent({
  internalUserId,
  sessionId,
  eventTime,
  eventName,
  page,
  referrer,
  context,
  userId,
  userAgent,
}: {
  internalUserId: string
  sessionId: string
  eventTime: Date
  eventName: string
  page: string
  referrer?: string | null
  context: Record<any, any>
  userId?: string | null
  userAgent?: string | null
}) {
  return await prisma.event.create({
    data: {
      internalUserId,
      sessionId,
      eventName,
      eventTime,
      page,
      context,
      userId,
      referrer: referrer ?? null,
      userAgent: userAgent ?? null,
      createdAt: new Date(),
    },
  })
}
