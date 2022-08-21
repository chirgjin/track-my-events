import React from 'react'
import { buildRoutes } from 'src/helpers'
import UnAuthenticatedLayout from 'src/layouts/UnAuthenticated'
import Login from 'src/views/Login'
import Register from 'src/views/Register'
import LoggedInLayout from 'src/layouts/LoggedIn'
import Dashboard from 'src/views/Dashboard'
import Profile from 'src/views/Profile'
import Setup from 'src/views/Setup'

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
    path: '',
    component: <LoggedInLayout />,
    children: {
      overview: {
        path: '',
        component: <Dashboard />,
        displayName: (
          <>
            <i className="ni ni-tv-2 text-success" /> Dashboard
          </>
        ),
      },
      profile: {
        path: 'profile',
        component: <Profile />,
        displayName: (
          <>
            <i className="ni ni-single-02 text-default" /> Profile
          </>
        ),
      },
      setup: {
        path: 'setup',
        component: <Setup />,
        displayName: (
          <>
            <i className="fa-solid fa-list-check text-warning"></i> Setup
          </>
        ),
      },
    },
  },
} as const)
