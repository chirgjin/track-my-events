import { RefreshToken, refreshTokenRepository, User } from 'src/models'

export async function createRefreshToken({ user }: { user: User }) {
  return await refreshTokenRepository.createAndSave({
    userId: user.entityId,
    token: await RefreshToken.generateToken(),
    createdAt: new Date(),
  })
}
