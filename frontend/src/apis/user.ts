import { axios } from 'src/apis'
import { User } from 'src/helpers'
import auth from 'src/helpers/auth'

export async function updateUser(data: {
  name?: string
  oldPassword?: string
  password?: string
  confirmPassword?: string
}) {
  const response = await axios.put<{
    data: User
    errors: null
  }>('/api/user-service/v1/public/users/me/', data)

  auth.update({
    accessToken: auth.accessToken!,
    refreshToken: auth.refreshToken!,
    user: response.data.data,
  })

  return response.data.data
}
