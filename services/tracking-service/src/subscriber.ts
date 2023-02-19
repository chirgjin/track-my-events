import App from 'src/app'
import { findUser } from 'src/helpers'
import { EventData } from 'src/helpers/types'
import { pubsubClient } from 'src/redisClient'
import { createEvent } from 'src/services'

const app = new App()

app.initialize().then(async () => {
  console.log(`Connected subscriber. Listening for events`)
  await pubsubClient.subscribe('events', async (message) => {
    try {
      const eventData: EventData = JSON.parse(message)

      const user = await findUser({
        apiKey: eventData.apiKey,
      })

      await createEvent({
        internalUserId: user.id,

        sessionId: eventData.sessionId,
        eventTime: new Date(eventData.eventTime),
        eventName: eventData.eventName,
        page: eventData.page,
        referrer: eventData.referrer,
        context: eventData.context,
        userId: eventData.userId,
        userAgent: eventData.userAgent,
      })
    } catch (e) {
      console.error(e)
      console.error(`Malformed Event data: ${message}`)
    }
  })
})
