import React from 'react'
import { Container } from 'reactstrap'

export function Header(props: React.PropsWithChildren) {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">{props.children}</div>
        </Container>
      </div>{' '}
    </>
  )
}
