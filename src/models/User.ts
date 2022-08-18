import { Entity, Schema } from 'redis-om'

import { generateRandomString } from 'src/helpers'
import { client } from 'src/models'

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
