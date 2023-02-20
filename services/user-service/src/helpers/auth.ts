import { User } from '@prisma/client'
import argon2 from 'argon2'

import { prisma } from 'src/prismaClient'

export async function verifyToken(accessToken: string) {
  const accessTokenInstance = await prisma.accessToken.findFirst({
    where: {
      token: accessToken,
    },
    include: {
      user: true,
    },
  })

  if (
    !accessTokenInstance ||
    accessTokenInstance.expiresOn.getTime() < Date.now()
  ) {
    return null
  }

  return accessTokenInstance.user
}

export async function verifyPassword(user: User, password: string) {
  try {
    return await argon2.verify(user.password, password)
  } catch (e) {
    return false
  }
}
