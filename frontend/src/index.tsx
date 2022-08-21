import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes } from 'react-router-dom'
import './assets/nucleo/css/nucleo-svg.css'
import './assets/nucleo/css/nucleo.css'
import './assets/scss/argon-dashboard-react.scss'

import { renderRoutes } from 'src/helpers'
import reportWebVitals from 'src/reportWebVitals'
import { routes } from 'src/routes'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
    <Routes>{renderRoutes(routes)}</Routes>
  </BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
