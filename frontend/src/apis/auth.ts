import { axios, isAxiosError } from 'src/apis'
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

export async function register({
  email,
  password,
  confirmPassword,
  name,
}: {
  email: string
  password: string
  confirmPassword: string
  name: string
}) {
  const response = await axios.post<{
    data: {
      user: User
      accessToken: string
      refreshToken: string
    }
    errors: null
  }>('/api/user-service/v1/public/users/', {
    email,
    password,
    confirmPassword,
    name,
  })

  auth.update(response.data.data)

  return response.data.data
}

export async function refreshToken({ refreshToken }: { refreshToken: string }) {
  try {
    const response = await axios.post<{
      data: {
        user: User
        accessToken: string
        refreshToken: string
      }
      errors: null
    }>(`/api/user-service/v1/public/auth/refresh-token/`, {
      refreshToken,
    })

    auth.update(response.data.data)

    return response.data.data
  } catch (err) {
    if (
      isAxiosError(err) &&
      err.response &&
      err.response.status >= 400 &&
      err.response.status < 500
    ) {
      auth.update(null)
      window.location.reload()
    }
    throw err
  }
}

export async function logout() {
  await axios
    .post('/api/user-service/v1/public/auth/logout/', {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    })
    .catch((err) => console.error(err))

  auth.update(null)
}
