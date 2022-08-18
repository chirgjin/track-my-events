import argon2 from 'argon2'

import BadRequestException from 'src/exceptions/BadRequestException'
import { User, userRepository } from 'src/models'

export async function createUser({
  name,
  email,
  password,
}: Pick<User, 'name' | 'email' | 'password'>) {
  const userEmail = email.toLowerCase()

  if (
    (await userRepository.search().where('email').equals(userEmail).count()) > 0
  ) {
    throw new BadRequestException({
      email: 'User with this email already exists',
    })
  }

  const user = await userRepository.createAndSave({
    name,
    email: userEmail,
    password: await argon2.hash(password),
    apiKey: await User.generateApiKey(),
    createdAt: new Date(),
  })

  return user
}

export async function updateUser({
  name,
  password,
  user,
}: { user: User } & Partial<Pick<User, 'name' | 'password'>>) {
  if (name) {
    user.name = name
  }

  if (password) {
    user.password = await argon2.hash(password)
  }

  user.updatedAt = new Date()

  await userRepository.save(user)
}
