import { User } from '@prisma/client'
import argon2 from 'argon2'

import BadRequestException from 'src/exceptions/BadRequestException'
import { generateRandomString } from 'src/helpers'
import { prisma } from 'src/prismaClient'

export async function generateApiKey() {
  let apiKey: string

  do {
    apiKey = await generateRandomString(16)
  } while (
    (await prisma.user.count({
      where: {
        apiKey,
      },
    })) > 0
  )

  return apiKey
}

export async function createUser({
  name,
  email,
  password,
}: Pick<User, 'name' | 'email' | 'password'>) {
  const userEmail = email.toLowerCase()

  if (
    (await prisma.user.count({
      where: {
        email: userEmail,
      },
    })) > 0
  ) {
    throw new BadRequestException({
      email: 'User with this email already exists',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: userEmail,
      password: await argon2.hash(password),
      createdAt: new Date(),
      apiKey: await generateApiKey(),
    },
  })

  return user
}

export async function updateUser({
  name,
  password,
  user,
}: { user: User } & Partial<Pick<User, 'name' | 'password'>>) {
  const data: Partial<User> = {}

  if (name) {
    data.name = name
  }

  if (password) {
    data.password = await argon2.hash(password)
  }

  data.updatedAt = new Date()

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data,
  })
}
