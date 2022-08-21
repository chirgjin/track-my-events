import React from 'react'
import { Link, NavLink as RouteNavLink } from 'react-router-dom'
import {
  Navbar,
  Container,
  NavbarBrand,
  Nav,
  Collapse,
  Col,
  Row,
  NavItem,
  NavLink,
} from 'reactstrap'
import { routes } from 'src/routes'

export function SideBar() {
  const [collapseOpen, setCollapseOpen] = React.useState(false)

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setCollapseOpen((state) => !state)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <NavbarBrand
          className="pt-0"
          to={routes.dashboard.children.overview.fullPath}
          tag={Link}
        >
          <span className="h4">Tracking System</span>
        </NavbarBrand>

        <Collapse navbar isOpen={collapseOpen}>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              <Col>
                <Link
                  to={routes.dashboard.children.overview.fullPath}
                  className="h4"
                >
                  Tracking System
                </Link>
              </Col>
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={() => setCollapseOpen((state) => !state)}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          <Nav navbar>
            {Object.values(routes.dashboard.children)
              .filter((route) => route.displayName)
              .map((route) => {
                return (
                  <NavItem key={route.path}>
                    <NavLink to={route.fullPath} tag={RouteNavLink}>
                      {route.displayName}
                    </NavLink>
                  </NavItem>
                )
              })}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  )
}
