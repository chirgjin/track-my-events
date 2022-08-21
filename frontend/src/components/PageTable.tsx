import React from 'react'
import { Card, CardHeader, Row, Table } from 'reactstrap'
import { eventsList } from 'src/apis'

export function PageTable() {
  const [pageData, setPageData] = React.useState<
    {
      page: string
      count: number
      users: number
      sessions: number
    }[]
  >()

  React.useEffect(() => {
    let ignore = false

    async function fetchData() {
      if (!ignore) {
        const data = await eventsList('page')
        setPageData(data)
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
              <h3 className="mb-0">Page Visits</h3>
            </div>
          </Row>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th>Page</th>
              <th>Count</th>
              <th>Users</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {pageData ? (
              pageData.map((page) => {
                return (
                  <tr key={page.page}>
                    <th>{page.page}</th>
                    <td>{page.count}</td>
                    <td>{page.users}</td>
                    <td>{page.sessions}</td>
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
