import argon2 from 'argon2'
import { Entity, Schema } from 'redis-om'

import { generateRandomString } from 'src/helpers'
import { client } from 'src/redisClient'

export class User extends Entity {
  public name: string
  public email: string
  public password: string
  public apiKey: string
  public createdAt: Date
  public updatedAt: Date | null

  public static async generateApiKey() {
    let apiKey: string

    do {
      apiKey = await generateRandomString(16)
    } while (
      (await userRepository.search().where('apiKey').equals(apiKey).count()) > 0
    )

    return apiKey
  }

  public async verifyPassword(password: string) {
    try {
      return await argon2.verify(this.password, password)
    } catch (e) {
      return false
    }
  }

  public toJSON(): Record<string, any> {
    const json = super.toJSON()

    delete json.password

    return json
  }
}

export const userSchema = new Schema(User, {
  name: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
  password: {
    type: 'string',
  },
  apiKey: {
    type: 'string',
  },

  createdAt: {
    type: 'date',
  },
  updatedAt: {
    type: 'date',
  },
})

export const userRepository = client.fetchRepository(userSchema)
