import { User } from '@prisma/client'

import { generateToken } from 'src/helpers'
import { prisma } from 'src/prismaClient'

export async function createAccessToken({
  user,
  expiresOn,
}: {
  user: User
  expiresOn?: Date
}) {
  return await prisma.accessToken.create({
    data: {
      userId: user.id,
      expiresOn: expiresOn || new Date(Date.now() + 3600000), //default expiry in 1 hour
      createdAt: new Date(),
      token: await generateToken(prisma.accessToken),
    },
  })
}
