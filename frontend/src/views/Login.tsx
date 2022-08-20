import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Row,
} from 'reactstrap'
import { login, isAxiosError, ErrorResponse } from 'src/apis'
import { routes } from 'src/routes'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState<{
    error: false | string
    value: string
  }>({
    error: false,
    value: '',
  })
  const [password, setPassword] = React.useState<{
    error: false | string
    value: string
  }>({
    error: false,
    value: '',
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password.error || email.error || loading) {
      return
    }

    setLoading(true)

    try {
      await login({
        email: email.value,
        password: password.value,
      })

      //TODO: navigate to dashboard
      navigate(routes.auth.children.register.fullPath)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        const data = error.response.data as ErrorResponse

        for (const key in data.errors) {
          if (key === 'email') {
            setEmail((state) => ({
              error: data.errors[key].toString(),
              value: state.value,
            }))
          } else if (key === 'password') {
            setPassword((state) => ({
              error: data.errors[key].toString(),
              value: state.value,
            }))
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary shadow border-0">
              <CardHeader className="bg-transparent">
                <div className="text-center display-4">Login</div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup
                    className={`mb-3 ${(email.error && 'has-danger') || ''}`}
                  >
                    <InputGroup>
                      <Input
                        placeholder="Email"
                        type="email"
                        autoComplete="new-email"
                        value={email.value}
                        onChange={(event) =>
                          setEmail({
                            value: event.target.value,
                            error: false,
                          })
                        }
                        className={(email.error && 'is-invalid') || ''}
                      />
                    </InputGroup>
                    {email.error ? (
                      <small className="text-warning p-2">{email.error}</small>
                    ) : null}
                  </FormGroup>
                  <FormGroup className={(password.error && 'has-danger') || ''}>
                    <InputGroup>
                      <Input
                        placeholder="Password"
                        type="password"
                        autoComplete="new-password"
                        value={password.value}
                        onChange={(event) => {
                          setPassword({
                            value: event.target.value,
                            error: false,
                          })
                        }}
                        className={(password.error && 'is-invalid') || ''}
                      />
                    </InputGroup>
                    {password.error ? (
                      <small className="text-warning p-2">
                        {password.error}
                      </small>
                    ) : null}
                  </FormGroup>
                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      Sign in
                    </Button>
                    <br />

                    <div className="mb-2">
                      <small>Don't have an account?</small>
                    </div>
                    <Link
                      to={routes.auth.children.register.fullPath}
                      className="btn btn-outline-default"
                    >
                      Create Account
                    </Link>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
