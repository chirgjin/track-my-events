import { accessTokenRepository, userRepository } from 'src/models'

export async function verifyToken(accessToken: string) {
  const accessTokenInstance = await accessTokenRepository
    .search()
    .where('token')
    .equals(accessToken)
    .first()

  if (!accessTokenInstance || !accessTokenInstance.isValid) {
    return null
  }

  const user = await userRepository.fetch(accessTokenInstance.userId)

  return user
}
