import React from 'react'
import { buildRoutes } from 'src/helpers'
import UnAuthenticatedLayout from 'src/layouts/UnAuthenticated'
import Login from 'src/views/Login'
import Register from 'src/views/Register'
import LoggedInLayout from 'src/layouts/LoggedIn'
import Dashboard from './views/Dashboard'

export const routes = buildRoutes({
  auth: {
    path: 'auth',
    component: <UnAuthenticatedLayout />,
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

  dashboard: {
    path: 'dashboard',
    component: <LoggedInLayout />,
    children: {
      overview: {
        path: '',
        component: <Dashboard />,
      },
    },
  },
} as const)
