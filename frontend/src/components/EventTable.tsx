import React from 'react'
import { Card, CardHeader, Row, Table } from 'reactstrap'
import { eventsList } from 'src/apis'

export function EventTable() {
  const [events, setEvents] = React.useState<
    {
      eventName: string
      count: number
      users: number
      sessions: number
    }[]
  >()

  React.useEffect(() => {
    let ignore = false

    async function fetchData() {
      if (!ignore) {
        const data = await eventsList('eventName')
        setEvents(data)
      }
    }

    fetchData()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <>
      <Card className="shadow">
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <div className="col">
              <h3 className="mb-0">Events</h3>
            </div>
          </Row>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th>Event Name</th>
              <th>Count</th>
              <th>Users</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {events ? (
              events.map((event) => {
                return (
                  <tr key={event.eventName}>
                    <th>{event.eventName}</th>
                    <td>{event.count}</td>
                    <td>{event.users}</td>
                    <td>{event.sessions}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <th colSpan={3} className="text-center">
                  <i className="fas fa-spin fa-spinner" /> Loading...
                </th>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
