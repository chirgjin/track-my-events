import { Request, Response } from 'express'

import BadRequestException from 'src/exceptions/BadRequestException'
import { verifyPassword } from 'src/helpers'
import {
  createUser,
  updateUser,
  createAccessToken,
  createRefreshToken,
} from 'src/services'
import { StringField, validate } from 'src/validator'

export default class {
  public async create(req: Request, res: Response) {
    const body = await validate(req.body, {
      name: new StringField({ maxLength: 256, minLength: 3 }),
      email: new StringField({ email: true, maxLength: 256, minLength: 3 }),
      password: new StringField({ maxLength: 64, minLength: 6 }),
      confirmPassword: new StringField({ maxLength: 64, minLength: 6 }),
    })

    if (body.password !== body.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: 'Passwords do not match',
      })
    }

    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
    })

    try {
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
    } catch (e) {
      console.error(e)

      return res.success(
        {
          user,
        },
        201
      )
    }
  }

  public async me(req: Request, res: Response) {
    const user = req.user!

    return res.success(user, 200)
  }

  public async update(req: Request, res: Response) {
    const body = await validate(req.body, {
      name: new StringField({ maxLength: 256, minLength: 3, required: false }),
      oldPassword: new StringField({
        maxLength: 64,
        minLength: 6,
        required: false,
      }),
      password: new StringField({
        maxLength: 64,
        minLength: 6,
        required: false,
      }),
      confirmPassword: new StringField({
        maxLength: 64,
        minLength: 6,
        required: false,
      }),
    })

    const user = req.user!
    const data: {
      name?: string
      password?: string
    } = {
      name: body.name,
    }

    if (body.oldPassword || body.password || body.confirmPassword) {
      if (
        !body.oldPassword ||
        !(await verifyPassword(user, body.oldPassword))
      ) {
        throw new BadRequestException({
          oldPassword: 'Incorrect password',
        })
      } else if (body.password !== body.confirmPassword || !body.password) {
        throw new BadRequestException({
          confirmPasword: 'Passwords do not match',
        })
      }

      data.password = body.password
    }

    await updateUser({ user, ...data })

    return res.success(user, 200)
  }
}
