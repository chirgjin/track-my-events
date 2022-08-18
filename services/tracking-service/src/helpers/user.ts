import axios from 'axios'

import { USER_SERVICE_URL } from 'src/config'
import BadRequestException from 'src/exceptions/BadRequestException'
import { User } from 'src/helpers/types'

export async function findUser(
  searchParams: { id: string } | { apiKey: string }
) {
  try {
    const resp = await axios.get<{
      data: User
    }>(`${USER_SERVICE_URL}/v1/internal/users/find/`, {
      params: searchParams,
    })

    return resp.data.data
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response as Record<any, any>).data.errors
    ) {
      throw new BadRequestException(
        (error.response as Record<any, any>).data.errors
      )
    }

    throw error
  }
}
