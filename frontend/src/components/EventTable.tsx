import React from 'react'
import { Card, CardHeader, Row, Table } from 'reactstrap'

export function EventTable() {
  const [events, setEvents] = React.useState<
    {
      name: string
      count: number
      uniqueUsers: number
    }[]
  >([
    {
      name: 'Test',
      count: 10,
      uniqueUsers: 1,
    },
  ])

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
              <th>Unique users</th>
            </tr>
          </thead>
          <tbody>
            {events ? (
              events.map((event) => {
                return (
                  <tr key={event.name}>
                    <th>{event.name}</th>
                    <td>{event.count}</td>
                    <td>{event.uniqueUsers}</td>
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
