import { omClient } from 'src/redisClient'

/**
 * Helper function to run FT.AGGREGATE & parse it's results.
 */
export async function aggregate<T extends Record<any, any>>(
  args: (string | number)[]
) {
  const response = (await omClient.execute(args)) as string[][]
  // redis returns the data like:
  // [1, ["eventName", "page_view", "count", 1]]
  // so we have to manually convert it to object

  response.shift() // discard first element
  const objects: Record<any, any>[] = []

  response.forEach((resp) => {
    const obj: Record<any, any> = {}

    for (let i = 0; i < resp.length; i++) {
      obj[resp[i]] = resp[++i]
    }

    objects.push(obj)
  })

  return objects as T[]
}
