import { axios } from 'src/apis'
import auth, { User } from 'src/helpers/auth'

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const response = await axios.post<{
    data: {
      user: User
      accessToken: string
      refreshToken: string
    }
    errors: null
  }>('/api/user-service/v1/public/auth/login/', {
    email,
    password,
  })

  auth.update(response.data.data)

  return response.data.data
}
