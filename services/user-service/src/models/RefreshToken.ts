import { Entity, Schema } from 'redis-om'

import { generateRandomString } from 'src/helpers'
import { client } from 'src/redisClient'

export class RefreshToken extends Entity {
  public static async generateToken() {
    let token: string

    do {
      token = await generateRandomString(24)
    } while (
      (await refreshTokenRepository
        .search()
        .where('token')
        .equals(token)
        .count()) > 0
    )

    return token
  }

  public userId: string

  public token: string

  public createdAt: Date
}

export const refreshTokenSchema = new Schema(RefreshToken, {
  userId: {
    type: 'string',
    indexed: true,
  },
  token: {
    type: 'string',
    indexed: true,
  },
  expiresOn: {
    type: 'date',
  },
  createdAt: {
    type: 'date',
  },
})

export const refreshTokenRepository = client.fetchRepository(refreshTokenSchema)
