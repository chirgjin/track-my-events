import axios from 'axios'

import { USER_SERVICE_URL } from 'src/config'
import ServiceException from 'src/exceptions/ServiceException'
import { User } from 'src/helpers/types'

export async function fetchUser(token: string) {
  try {
    const resp = await axios.get<{
      data: User
    }>(`${USER_SERVICE_URL}/v1/public/users/me/`, {
      headers: {
        Authorization: token,
      },
    })

    return resp.data.data
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response as Record<any, any>).data.errors
    ) {
      throw new ServiceException(
        (error.response as Record<any, any>).data.errors,
        error.response!.status
      )
    }

    throw error
  }
}
