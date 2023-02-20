import { Request, Response } from 'express'

import BadRequestException from 'src/exceptions/BadRequestException'
import { verifyPassword } from 'src/helpers'
import { prisma } from 'src/prismaClient'
import { createAccessToken, createRefreshToken } from 'src/services'
import { StringField, validate } from 'src/validator'

export default class {
  public async login(req: Request, res: Response) {
    const body = await validate(req.body, {
      email: new StringField({ email: true, maxLength: 256, minLength: 3 }),
      password: new StringField({ maxLength: 32, minLength: 3 }),
    })

    const user = await prisma.user.findFirst({
      where: {
        email: body.email.toLowerCase(),
      },
    })

    if (!user) {
      throw new BadRequestException({
        email: "User with this email doesn't exist",
      })
    }

    if (!(await verifyPassword(user, body.password))) {
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

    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        token: body.refreshToken,
      },
      include: {
        user: true,
      },
    })

    if (!refreshToken) {
      throw new BadRequestException({
        refreshToken: 'Invalid refresh token',
      })
    }

    const user = refreshToken.user

    const accessToken = await createAccessToken({
      user,
    })
    const newRefreshToken = await createRefreshToken({ user })

    await prisma.refreshToken.delete({
      where: {
        id: refreshToken.id,
      },
    })

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

    const accessToken = await prisma.accessToken.findFirst({
      where: {
        token: body.accessToken,
      },
    })

    if (accessToken) {
      await prisma.accessToken.delete({
        where: {
          id: accessToken.id,
        },
      })
    }

    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        token: body.refreshToken,
      },
    })

    if (refreshToken) {
      await prisma.refreshToken.delete({
        where: {
          id: refreshToken.id,
        },
      })
    }

    return res.success({}, 200)
  }
}
