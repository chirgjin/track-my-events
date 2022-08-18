import { AccessToken, accessTokenRepository, User } from 'src/models'

export async function createAccessToken({
  user,
  expiresOn,
}: {
  user: User
  expiresOn?: Date
}) {
  return await accessTokenRepository.createAndSave({
    userId: user.entityId,
    token: await AccessToken.generateToken(),
    expiresOn: expiresOn || new Date(Date.now() + 3600000), //default expiry in 1 hour
    createdAt: new Date(),
  })
}
