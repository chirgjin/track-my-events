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
import { register, isAxiosError, ErrorResponse } from 'src/apis'
import { FormState } from 'src/helpers'
import { routes } from 'src/routes'

export default function Register() {
  const navigate = useNavigate()

  const [loading, setLoading] = React.useState(false)
  const [state, setState] = React.useState<
    FormState<'email' | 'password' | 'confirmPassword' | 'name'>
  >({
    email: {
      value: '',
    },
    password: {
      value: '',
    },
    confirmPassword: {
      value: '',
    },
    name: {
      value: '',
    },
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      loading ||
      Object.keys(state).filter((key) => state[key as keyof typeof state].error)
        .length > 0
    ) {
      return
    }

    setLoading(true)

    try {
      await register({
        email: state.email.value,
        password: state.password.value,
        confirmPassword: state.confirmPassword.value,
        name: state.name.value,
      })

      //TODO: navigate to dashboard
      navigate(routes.auth.children.register.fullPath)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        const data = error.response.data as ErrorResponse

        for (const key in data.errors) {
          if (key in state) {
            setState((state) => ({
              ...state,
              [key]: {
                error: data.errors[key].toString(),
                value: state[key as keyof typeof state].value,
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
                <div className="text-center display-4">Register</div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup
                    className={`mb-3 ${
                      (state.name.error && 'has-danger') || ''
                    }`}
                  >
                    <InputGroup>
                      <Input
                        placeholder="Name"
                        type="text"
                        autoComplete="name"
                        value={state.name.value}
                        onChange={handleOnChange.bind(null, 'name')}
                        className={(state.name.error && 'is-invalid') || ''}
                        required
                        minLength={3}
                        maxLength={256}
                      />
                    </InputGroup>
                    {state.name.error ? (
                      <small className="text-warning p-2">
                        {state.name.error}
                      </small>
                    ) : null}
                  </FormGroup>
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
                        required
                        minLength={3}
                        maxLength={256}
                      />
                    </InputGroup>
                    {state.email.error ? (
                      <small className="text-warning p-2">
                        {state.email.error}
                      </small>
                    ) : null}
                  </FormGroup>
                  <FormGroup
                    className={`mb-3 ${
                      (state.password.error && 'has-danger') || ''
                    }`}
                  >
                    <InputGroup>
                      <Input
                        placeholder="Password"
                        type="password"
                        autoComplete="new-password"
                        value={state.password.value}
                        onChange={handleOnChange.bind(null, 'password')}
                        className={(state.password.error && 'is-invalid') || ''}
                        required
                        minLength={6}
                        maxLength={64}
                      />
                    </InputGroup>
                    {state.password.error ? (
                      <small className="text-warning p-2">
                        {state.password.error}
                      </small>
                    ) : null}
                  </FormGroup>
                  <FormGroup
                    className={`mb-3 ${
                      (state.confirmPassword.error && 'has-danger') || ''
                    }`}
                  >
                    <InputGroup>
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={state.confirmPassword.value}
                        onChange={handleOnChange.bind(null, 'confirmPassword')}
                        className={
                          (state.confirmPassword.error && 'is-invalid') || ''
                        }
                        required
                        minLength={6}
                        maxLength={64}
                      />
                    </InputGroup>
                    {state.confirmPassword.error ? (
                      <small className="text-warning p-2">
                        {state.confirmPassword.error}
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
                      {loading && <i className="fas fa-spin fa-spinner mr-2" />}
                      Create Account
                    </Button>
                    <br />

                    <div className="mb-2">
                      <small>Already have an account?</small>
                    </div>
                    <Link
                      to={routes.auth.children.login.fullPath}
                      className="btn btn-outline-default"
                    >
                      Login
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
