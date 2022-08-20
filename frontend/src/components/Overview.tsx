import React from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap'

export function Overview() {
  const [state, setState] = React.useState<{
    eventsRecorded: {
      thisMonth: null | string
      today: null | string
    }
    activeUsers: {
      thisMonth: null | string
      today: null | string
    }
  }>({
    eventsRecorded: {
      thisMonth: null,
      today: null,
    },
    activeUsers: {
      thisMonth: null,
      today: null,
    },
  })

  return (
    <>
      <Row>
        <Col lg="6" xl="3">
          <Card className="card-stats mb-4 mb-xl-0">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Events Recorded{' '}
                    <span className="h6 text-muted">(This Month)</span>
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {state.eventsRecorded.thisMonth ?? (
                      <i className="fas fa-spin fa-spinner" />
                    )}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                    <i className="fas fa-chart-bar" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6" xl="3">
          <Card className="card-stats mb-4 mb-xl-0">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Events Recorded{' '}
                    <span className="h6 text-muted">(Today)</span>
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {state.eventsRecorded.today ?? (
                      <i className="fas fa-spin fa-spinner" />
                    )}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                    <i className="fas fa-chart-bar" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        {/* Active users */}
        <Col lg="6" xl="3">
          <Card className="card-stats mb-4 mb-xl-0">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Active Users{' '}
                    <span className="h6 text-muted">(This Month)</span>
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {state.activeUsers.thisMonth ?? (
                      <i className="fas fa-spin fa-spinner" />
                    )}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                    <i className="fas fa-users" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6" xl="3">
          <Card className="card-stats mb-4 mb-xl-0">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Active Users{' '}
                    <span className="h6 text-muted mr-4">(Today)</span>
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {state.activeUsers.today ?? (
                      <i className="fas fa-spin fa-spinner" />
                    )}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                    <i className="fas fa-users" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
