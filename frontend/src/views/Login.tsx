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
import { FormState } from 'src/helpers'
import { routes } from 'src/routes'

export default function Login() {
  const navigate = useNavigate()

  const [loading, setLoading] = React.useState(false)
  const [state, setState] = React.useState<FormState<'email' | 'password'>>({
    email: {
      value: '',
    },
    password: {
      value: '',
    },
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (state.password.error || state.email.error || loading) {
      return
    }

    setLoading(true)

    try {
      await login({
        email: state.email.value,
        password: state.password.value,
      })

      //TODO: navigate to dashboard
      navigate(routes.auth.children.register.fullPath)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        const data = error.response.data as ErrorResponse

        for (const key in data.errors) {
          if (key === 'email' || key === 'password') {
            setState((state) => ({
              ...state,
              [key]: {
                error: data.errors[key].toString(),
                value: state[key].value,
              },
            }))
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  function handleOnChange(
    key: keyof typeof state,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setState((state) => ({
      ...state,
      [key]: {
        value: event.target.value,
      },
    }))
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
                    className={`mb-3 ${
                      (state.email.error && 'has-danger') || ''
                    }`}
                  >
                    <InputGroup>
                      <Input
                        placeholder="Email"
                        type="email"
                        autoComplete="new-email"
                        value={state.email.value}
                        onChange={handleOnChange.bind(null, 'email')}
                        className={(state.email.error && 'is-invalid') || ''}
                      />
                    </InputGroup>
                    {state.email.error ? (
                      <small className="text-warning p-2">
                        {state.email.error}
                      </small>
                    ) : null}
                  </FormGroup>
                  <FormGroup
                    className={(state.password.error && 'has-danger') || ''}
                  >
                    <InputGroup>
                      <Input
                        placeholder="Password"
                        type="password"
                        autoComplete="new-password"
                        value={state.password.value}
                        onChange={handleOnChange.bind(null, 'password')}
                        className={(state.password.error && 'is-invalid') || ''}
                      />
                    </InputGroup>
                    {state.password.error ? (
                      <small className="text-warning p-2">
                        {state.password.error}
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
