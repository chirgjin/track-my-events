import React from 'react'

import { Card, CardBody, CardHeader, Container } from 'reactstrap'
import { Header } from 'src/components'
import { sdkSnippet, setUserIdSnippet, trackManuallySnippet } from 'src/helpers'
import auth from 'src/helpers/auth'

export default function Setup({ hasEvents = true }: { hasEvents?: boolean }) {
  return (
    <>
      <Header></Header>

      <Container className="mt--8 text-center">
        <Card className="bg-gradient-default shadow mb-xl-4">
          <CardHeader className="bg-transparent">
            <h2 className="mb-0 text-light">Setup</h2>
          </CardHeader>
          <CardBody className="text-justify text-white">
            {!hasEvents && (
              <p className="h3 text-warning text-center">
                <i className="fas fa-solid fa-triangle-exclamation" /> There are
                no events yet! Setup the SDK to start seeing event data
              </p>
            )}

            <ul>
              <li>
                Paste the following code after &lt;head&gt; section of your
                page:
                <br />
                <textarea
                  className="form-control"
                  value={sdkSnippet.replace('{{API_KEY}}', auth.user!.apiKey)}
                  rows={7}
                  readOnly
                ></textarea>
              </li>
              <li className="mt-2">
                (Optional) Set the user id to better track your users
                <textarea
                  className="form-control"
                  readOnly
                  value={setUserIdSnippet}
                ></textarea>
              </li>

              <li>
                (Advanced) Capturing events manually:
                <br />
                <p className="ml-2">
                  You can use the <code>window.__trk.trackEvent</code> function
                  to capture events manually. For Example:
                  <textarea
                    className="form-control"
                    readOnly
                    value={trackManuallySnippet}
                    rows={10}
                  ></textarea>
                </p>
              </li>
            </ul>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}
