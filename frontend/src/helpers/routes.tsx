import { Route } from 'react-router-dom'

type BaseRoute = {
  path: string
  component: React.ReactNode
  children?: Record<string, BaseRoute>
}

type ProcessedRoute<Route extends BaseRoute = BaseRoute> = Route & {
  fullPath: string
  children: Route['children'] extends undefined
    ? undefined
    : ProcessedRoutes<NonNullable<Route['children']>>
}

export type ProcessedRoutes<R extends Record<string, BaseRoute>> = {
  [Key in keyof R]: ProcessedRoute<R[Key]>
}

export function buildRoutes<R extends Record<string, BaseRoute>>(
  routes: R,
  basePath: string = ''
) {
  Object.keys(routes).forEach((key) => {
    const route = routes[key] as unknown as ProcessedRoute
    route.fullPath = `${basePath.replace(/\/$/, '')}/${routes[key].path.replace(
      /\/$/,
      ''
    )}`

    if (route.children) {
      buildRoutes(route.children, route.fullPath)
    }
  })

  return routes as ProcessedRoutes<R>
}

export function renderRoutes<R extends Record<string, BaseRoute>>(
  routeList: R
) {
  const elements: React.ReactElement[] = []

  Object.keys(routeList).forEach((key) => {
    const route = routeList[key as keyof typeof routeList]

    elements.push(
      <Route path={route.path} element={route.component} key={key}>
        {route.children && renderRoutes(route.children)}
      </Route>
    )
  })

  return elements
}
