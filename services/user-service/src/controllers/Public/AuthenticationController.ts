import { Request, Response } from 'express'

import BadRequestException from 'src/exceptions/BadRequestException'
import {
  accessTokenRepository,
  refreshTokenRepository,
  userRepository,
} from 'src/models'
import { createAccessToken, createRefreshToken } from 'src/services'
import { StringField, validate } from 'src/validator'

export default class {
  public async login(req: Request, res: Response) {
    const body = await validate(req.body, {
      email: new StringField({ email: true, maxLength: 256, minLength: 3 }),
      password: new StringField({}),
    })

    const user = await userRepository
      .search()
      .where('email')
      .equals(body.email.toLowerCase())
      .first()

    if (!user) {
      throw new BadRequestException({
        email: "User with this email doesn't exist",
      })
    }

    if (!(await user.verifyPassword(body.password))) {
      throw new BadRequestException({
        password: 'Incorrect password',
      })
    }

    const accessToken = await createAccessToken({ user })
    const refreshToken = await createRefreshToken({ user })

    return res.success(
      {
        user,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
      },
      201
    )
  }

  public async refreshToken(req: Request, res: Response) {
    const body = await validate(req.body, {
      refreshToken: new StringField({}),
    })

    const refreshToken = await refreshTokenRepository
      .search()
      .where('token')
      .equals(body.refreshToken)
      .first()

    if (!refreshToken) {
      throw new BadRequestException({
        refreshToken: 'Invalid refresh token',
      })
    }

    const user = await userRepository.fetch(refreshToken.userId)

    const accessToken = await createAccessToken({
      user,
    })
    const newRefreshToken = await createRefreshToken({ user })

    await refreshTokenRepository.remove(refreshToken.entityId)

    return res.success(
      {
        accessToken: accessToken.token,
        refreshToken: newRefreshToken.token,
        user,
      },
      200
    )
  }

  public async logout(req: Request, res: Response) {
    const body = await validate(req.body, {
      refreshToken: new StringField({}),
      accessToken: new StringField({}),
    })

    const accessToken = await accessTokenRepository
      .search()
      .where('token')
      .equals(body.accessToken)
      .first()

    if (accessToken) {
      await accessTokenRepository.remove(accessToken.entityId)
    }

    const refreshToken = await refreshTokenRepository
      .search()
      .where('token')
      .equals(body.refreshToken)
      .first()

    if (refreshToken) {
      await refreshTokenRepository.remove(refreshToken.entityId)
    }

    return res.success({}, 200)
  }
}
