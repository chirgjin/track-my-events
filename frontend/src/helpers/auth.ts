export type User = {
  entityId: string
  name: string
  email: string
  apiKey: string
  createdAt: string
  updatedAt: string | null
}

class AuthHandler {
  private localStorageKey = 'auth'
  private authData?: {
    accessToken: string
    refreshToken: string
    user: User
  }

  public get isLoggedIn() {
    return Boolean(this.accessToken && this.refreshToken && this.user)
  }

  constructor() {
    try {
      this.authData = JSON.parse(
        localStorage.getItem(this.localStorageKey) || '{}'
      )
    } catch (e) {
    } finally {
      if (
        !this.authData?.accessToken ||
        !this.authData?.refreshToken ||
        !this.authData?.refreshToken
      ) {
        delete this.authData
        localStorage.removeItem(this.localStorageKey)
      }
    }
  }

  public update(data: typeof this.authData | null) {
    this.authData = data || undefined

    if (!this.authData) {
      localStorage.removeItem(this.localStorageKey)
    } else {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.authData))
    }
  }

  public get accessToken() {
    return this.authData?.accessToken
  }

  public get refreshToken() {
    return this.authData?.refreshToken
  }

  public get user() {
    return this.authData?.user
  }
}

export default new AuthHandler()
