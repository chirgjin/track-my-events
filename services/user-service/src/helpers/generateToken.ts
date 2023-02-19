import { PrismaClient } from '@prisma/client'

import { generateRandomString } from 'src/helpers'

export async function generateToken(
  model: PrismaClient['accessToken'] | PrismaClient['refreshToken']
) {
  let token: string

  do {
    token = await generateRandomString(24)
  } while (
    (await (model as any).count({
      where: {
        token,
      },
    })) > 0
  )

  return token
}
