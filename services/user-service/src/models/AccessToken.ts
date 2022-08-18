import { Entity, Schema } from 'redis-om'

import { generateRandomString } from 'src/helpers'
import { client } from 'src/redisClient'

export class AccessToken extends Entity {
  public static async generateToken() {
    let token: string

    do {
      token = await generateRandomString(24)
    } while (
      (await accessTokenRepository
        .search()
        .where('token')
        .equals(token)
        .count()) > 0
    )

    return token
  }

  public userId: string

  public token: string

  public expiresOn: Date

  public createdAt: Date

  public get isValid() {
    return this.expiresOn.getTime() > Date.now()
  }
}

export const accessTokenSchema = new Schema(AccessToken, {
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

export const accessTokenRepository = client.fetchRepository(accessTokenSchema)
