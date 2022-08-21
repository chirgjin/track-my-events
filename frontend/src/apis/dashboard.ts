import { axios } from 'src/apis'

export async function overview() {
  const response = await axios.get<{
    data: {
      eventsRecorded: {
        thisMonth: string
        today: string
      }
      activeUsers: {
        thisMonth: string
        today: string
      }
    }
  }>('/api/tracking-service/v1/public/events/overview/')

  return response.data.data
}

export async function dailyActiveUsers() {
  const response = await axios.get<{
    data: {
      day: string
      users: number
      sessions: number
    }[]
  }>('/api/tracking-service/v1/public/events/dau/')

  return response.data.data.reverse()
}

export async function eventsList<T extends 'eventName' | 'page'>(groupBy: T) {
  const response = await axios.get<{
    data: ({
      count: number
      users: number
      sessions: number
    } & Record<T, string>)[]
  }>('/api/tracking-service/v1/public/events/', {
    params: {
      groupBy,
    },
  })

  return response.data.data
}
