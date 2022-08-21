import React from 'react'

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
import { ErrorResponse, isAxiosError, updateUser } from 'src/apis'
import { Header } from 'src/components'
import { FormState } from 'src/helpers'
import auth from 'src/helpers/auth'

export default function Profile() {
  const [loading, setLoading] = React.useState(false)
  const [state, setState] = React.useState<
    FormState<'name' | 'oldPassword' | 'password' | 'confirmPassword'>
  >({
    name: {
      value: auth.user!.name,
    },
    oldPassword: {
      value: '',
    },
    password: {
      value: '',
    },
    confirmPassword: {
      value: '',
    },
  })

  async function handleSubmit(
    type: 'name' | 'password',
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const keys =
      type === 'name'
        ? ['name']
        : ['oldPassword', 'password', 'confirmPassword']
    if (
      loading ||
      keys.filter((key) => !!state[key as keyof typeof state].error).length > 0
    ) {
      return
    }

    setLoading(true)

    try {
      await updateUser(
        keys.reduce((acc, key) => {
          acc[key] = state[key as keyof typeof state].value
          return acc
        }, {} as Record<any, string>)
      )
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
      <Header></Header>

      <Container className="mt--8 text-center">
        <Row>
          <Col lg="6">
            <Card className="bg-secondary shadow mb-xl-4">
              <CardHeader>
                <h2 className="mb-0">Personal Details</h2>
              </CardHeader>
              <CardBody className="text-left">
                <Form onSubmit={handleSubmit.bind(null, 'name')}>
                  <h4 className="text-muted">
                    API Key <small>(Use this when making API calls)</small>
                  </h4>
                  <FormGroup className="mb-xl-4">
                    <InputGroup>
                      <Input disabled type="text" value={auth.user!.apiKey} />
                    </InputGroup>
                  </FormGroup>

                  <h4 className="text-muted">Email</h4>
                  <FormGroup className="mb-xl-4">
                    <InputGroup>
                      <Input disabled type="text" value={auth.user!.email} />
                    </InputGroup>
                  </FormGroup>

                  <h4 className="text-muted">Name</h4>
                  <FormGroup
                    className={(state.name.error && 'has-danger') || ''}
                  >
                    <InputGroup>
                      <Input
                        type="text"
                        className={(state.name.error && 'is-invalid') || ''}
                        value={state.name.value}
                        minLength={3}
                        maxLength={64}
                        required
                        onChange={handleOnChange.bind(null, 'name')}
                      />
                    </InputGroup>
                    {state.name.error ? (
                      <small className="text-warning p-2">
                        {state.name.error}
                      </small>
                    ) : null}
                  </FormGroup>

                  <div className="text-center">
                    <Button
                      className="my-lg-4"
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading && <i className="fas fa-spin fa-spinner mr-2" />}
                      Save
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card className="bg-secondary shadow">
              <CardHeader>
                <h2 className="mb-0">Change Password</h2>
              </CardHeader>
              <CardBody className="text-left">
                <Form onSubmit={handleSubmit.bind(null, 'password')}>
                  <h4 className="text-muted">Current Password</h4>
                  <FormGroup
                    className={
                      'mb-lg-4 ' + (state.oldPassword.error && 'has-danger') ||
                      ''
                    }
                  >
                    <InputGroup>
                      <Input
                        type="text"
                        className={
                          (state.oldPassword.error && 'is-invalid') || ''
                        }
                        value={state.oldPassword.value}
                        minLength={3}
                        maxLength={64}
                        required
                        onChange={handleOnChange.bind(null, 'oldPassword')}
                      />
                    </InputGroup>
                    {state.oldPassword.error ? (
                      <small className="text-warning p-2">
                        {state.oldPassword.error}
                      </small>
                    ) : null}
                  </FormGroup>

                  <h4 className="text-muted">New Password</h4>
                  <FormGroup
                    className={
                      'mb-lg-4 ' + (state.password.error && 'has-danger') || ''
                    }
                  >
                    <InputGroup>
                      <Input
                        type="text"
                        className={(state.password.error && 'is-invalid') || ''}
                        value={state.password.value}
                        minLength={3}
                        maxLength={64}
                        required
                        onChange={handleOnChange.bind(null, 'password')}
                      />
                    </InputGroup>
                    {state.password.error ? (
                      <small className="text-warning p-2">
                        {state.password.error}
                      </small>
                    ) : null}
                  </FormGroup>

                  <h4 className="text-muted">Confirm Password</h4>
                  <FormGroup
                    className={
                      (state.confirmPassword.error && 'has-danger') || ''
                    }
                  >
                    <InputGroup>
                      <Input
                        type="text"
                        className={
                          (state.confirmPassword.error && 'is-invalid') || ''
                        }
                        value={state.confirmPassword.value}
                        minLength={3}
                        maxLength={64}
                        required
                        onChange={handleOnChange.bind(null, 'confirmPassword')}
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
                      className="my-lg-4"
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading && <i className="fas fa-spin fa-spinner mr-2" />}
                      Save
                    </Button>
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
