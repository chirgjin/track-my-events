import App from 'src/app'
import { pubsubClient } from 'src/redisClient'

const app = new App()

app.initialize().then(async () => {
  console.log(`Connected subscriber. Listening for events`)
  await pubsubClient.subscribe('events', (message) => {
    console.log(message)
  })
})
