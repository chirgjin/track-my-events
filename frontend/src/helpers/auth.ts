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
    user: {}
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

  public update(data: typeof this.authData) {
    this.authData = data

    if (!this.authData) {
      localStorage.removeItem(this.localStorageKey)
    } else {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.authData))
    }
  }

  public get accessToken() {
    return this.authData?.accessToken
  }

  public async refresh() {}

  public get user() {
    return this.authData?.user
  }
}

export default new AuthHandler()
