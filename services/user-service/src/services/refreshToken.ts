import { User } from '@prisma/client'

import { generateToken } from 'src/helpers'
import { prisma } from 'src/prismaClient'

export async function createRefreshToken({ user }: { user: User }) {
  return await prisma.refreshToken.create({
    data: {
      userId: user.id,
      createdAt: new Date(),
      token: await generateToken(prisma.refreshToken),
    },
  })
}
