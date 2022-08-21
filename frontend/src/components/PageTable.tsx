import React from 'react'
import { Card, CardHeader, Row, Table } from 'reactstrap'

export function PageTable() {
  const [pageData, setPageData] = React.useState<
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
              <h3 className="mb-0">Page Visits</h3>
            </div>
          </Row>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th>Page</th>
              <th>Count</th>
              <th>Unique users</th>
            </tr>
          </thead>
          <tbody>
            {pageData ? (
              pageData.map((page) => {
                return (
                  <tr key={page.name}>
                    <th>{page.name}</th>
                    <td>{page.count}</td>
                    <td>{page.uniqueUsers}</td>
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
