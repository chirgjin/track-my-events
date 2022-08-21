import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { SideBar } from 'src/components'
import auth from 'src/helpers/auth'
import { routes } from 'src/routes'

export default function LoggedInLayout() {
  if (!auth.isLoggedIn) {
    return <Navigate to={routes.auth.children.login.fullPath} />
  }

  return (
    <>
      <SideBar />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  )
}
