import React from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import { Chart, EventTable, Header, Overview, PageTable } from 'src/components'

export default function Dashboard() {
  return (
    <>
      <Header>
        <Overview />
      </Header>

      <Container fluid className="mt--7">
        <Card className="bg-gradient-default shadow">
          <CardHeader className="bg-transparent">
            <h6 className="text-uppercase text-light mb-1 ls-1">Overview</h6>
            <h2 className="text-white mb-0">Daily Active Users</h2>
          </CardHeader>
          <CardBody>
            <div className="chart">
              <Chart />
            </div>
          </CardBody>
        </Card>
      </Container>

      <Container fluid className="mt-3">
        <Row>
          <Col>
            <EventTable />
          </Col>
          <Col>
            <PageTable />
          </Col>
        </Row>
      </Container>
    </>
  )
}
