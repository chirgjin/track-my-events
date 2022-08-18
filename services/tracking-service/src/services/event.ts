import { eventRepository } from 'src/models'

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
  return await eventRepository.createAndSave({
    internalUserId,
    sessionId,
    eventTime,
    eventName,
    page,
    referrer: referrer ?? null,
    _context: JSON.stringify(context),
    userId: userId ?? null,
    userAgent: userAgent ?? null,
  })
}
