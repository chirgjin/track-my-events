import React from 'react'
import Login from 'src/views/Login'
import { buildRoutes } from 'src/helpers'
import Auth from './layouts/Auth'
import Register from './views/Register'

export const routes = buildRoutes({
  auth: {
    path: 'auth',
    component: <Auth />,
    children: {
      login: {
        path: 'login',
        component: <Login />,
      },
      register: {
        path: 'register',
        component: <Register />,
      },
    },
  },
} as const)
