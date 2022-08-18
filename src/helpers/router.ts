import {
  RequestHandler,
  Router as ExpressRouter,
  RouterOptions as ExpressRouterOptions,
  Request,
  Response,
  NextFunction,
} from 'express'
import { APP_ROOT } from 'src/config'

/**
 * HTTP Methods accepted by router
 */
export type Methods =
  | 'use'
  | 'all'
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'

/**
 * Type for controller functions.
 * Ensures that controller is in format `a.b`
 */
type Controller<ControllerFunction extends string> =
  ControllerFunction extends `${infer _Path}.${infer _FunctionName}`
    ? ControllerFunction
    : never

/**
 * Type for registering a controller for given path on router
 */
type RouterMethod = {
  <Path extends string, ControllerFunction extends string>(
    path: Path,
    controllerFunction: Controller<ControllerFunction>
  ): Route
}

/**
 * Interface for {@link Router}.
 * Contains various methods for mounting another router to it
 * & defining routes & middlewares.
 */
interface RouterContract {
  /**
   * Creates an express router & mounts all the middlewares & routes on it.
   * Also initializes the child routers
   */
  initialize(): ExpressRouter

  /**
   * Returns middlewares defined for this router
   */
  getMiddlewares(): RequestHandler[]

  /**
   * Add new middlewares for this router
   */
  middleware(...handlers: RequestHandler[]): this

  /**
   * Mount a child router to this router.
   */
  mount<Path extends string, RouterInstance extends RouterContract>(
    path: Path,
    router: RouterInstance
  ): void

  /**
   * Mount a child router to this router.
   */
  mount<RouterInstance extends RouterContract>(router: RouterInstance): void

  /**
   * Define a route which will only work for all methods
   */
  use: RouterMethod
  /**
   * Define a route which will only work for all methods
   */
  all: RouterMethod
  /**
   * Define a route which will only work for get method
   */
  get: RouterMethod
  /**
   * Define a route which will only work for post method
   */
  post: RouterMethod
  /**
   * Define a route which will only work for put method
   */
  put: RouterMethod
  /**
   * Define a route which will only work for delete method
   */
  delete: RouterMethod
  /**
   * Define a route which will only work for patch method
   */
  patch: RouterMethod
  /**
   * Define a route which will only work for options method
   */
  options: RouterMethod
  /**
   * Define a route which will only work for head method
   */
  head: RouterMethod
}

/**
 * Route defined by using {@link RouterMethod}.
 * Supports middlewares
 */
export class Route {
  private middlewares: RequestHandler[] = []

  constructor(private controller: string) {}

  /**
   * Add middlewares to this particular route
   */
  public middleware(...middlewares: RequestHandler[]) {
    this.middlewares.push(...middlewares)

    return this
  }

  /**
   * Execute middlewares for this route.
   * Callback is called when all the middlewares have been executed successfully.
   *
   * NOTE: Make sure you pass only a copy of `this.middlewares` to this function
   * & not the actual middlewares list.
   */
  private async executeMiddlewares(
    req: Request,
    res: Response,
    middlewares: RequestHandler[],
    callback: NextFunction
  ) {
    const middleware = middlewares.pop()

    if (!middleware) {
      return callback()
    }

    try {
      await Promise.resolve(
        middleware(req, res, (err) => {
          if (err) {
            callback(err)
          } else {
            this.executeMiddlewares(req, res, middlewares, callback)
          }
        })
      )
    } catch (err) {
      callback(err)
    }
  }

  /**
   * Import & execute the controller for this route.
   */
  private async executeController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const [file, method] = this.controller.split('.')

    const { default: Controller } = await import(
      `${APP_ROOT}/controllers/${file}`
    )

    const controller = new Controller()
    await controller[method](req, res, next)
  }

  /**
   * Returns a function which acts as express controller & executes all the middlewares
   * & then the actual controller.
   */
  public createHandler() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.executeMiddlewares(
        req,
        res,
        [...this.middlewares].reverse(),
        (err: Error | string) => {
          if (err) {
            next(err)
          } else {
            this.executeController(req, res, next).catch(next)
          }
        }
      )
    }
  }
}

/**
 * Router class for handling routing & middlewares using controller functions.
 */
export const Router: {
  new (options?: ExpressRouterOptions): RouterContract
} = class Router implements RouterContract {
  private routerOptions?: ExpressRouterOptions
  private middlewares: RequestHandler[] = []
  private routes: {
    method: Methods
    path?: string
    route: Route | Router
  }[] = []

  constructor(options?: ExpressRouterOptions) {
    this.routerOptions = options
  }

  /**
   * Returns middlewares defined for this router
   */
  public getMiddlewares() {
    return this.middlewares
  }

  /**
   * Add a new route to this router for given method.
   */
  private applyMethod<Method extends Methods>(
    method: Method,
    path: string,
    controller: string
  ) {
    const route = new Route(controller)

    this.routes.push({
      method,
      path,
      route,
    })

    return route
  }

  /**
   * Add new middlewares for this router
   */
  public middleware(...handlers: RequestHandler[]) {
    this.middlewares.push(...handlers)

    return this
  }

  /**
   * Creates an express router & mounts all the middlewares & routes on it.
   * Also initializes the child routers
   */
  public initialize() {
    const expressRouter = ExpressRouter(this.routerOptions)

    this.middlewares.forEach((handler) => {
      expressRouter.use((req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch((err) => {
          next(err)
        })
      })
    })

    this.routes.forEach(({ route, method, path }) => {
      const handler =
        route instanceof Route ? route.createHandler() : route.initialize()

      if (path) {
        expressRouter[method](path, handler)
      } else {
        expressRouter.use(handler)
      }
    })

    return expressRouter
  }

  /**
   * Mount a child router to this router.
   */
  public mount(path: string | Router, router?: Router) {
    if (typeof path === 'string') {
      this.routes.push({
        route: router!,
        path,
        method: 'use',
      })
    } else {
      this.routes.push({
        route: path,
        method: 'use',
      })
    }
  }

  /**
   * @alias {@link all}
   */
  public get use() {
    return this.all
  }

  /**
   * Define a route which will only work for all methods
   */
  public all(path: string, controller: string) {
    return this.applyMethod('all', path, controller)
  }

  /**
   * Define a route which will only work for get method
   */
  public get(path: string, controller: string) {
    return this.applyMethod('get', path, controller)
  }

  /**
   * Define a route which will only work for post method
   */
  public post(path: string, controller: string) {
    return this.applyMethod('post', path, controller)
  }

  /**
   * Define a route which will only work for put method
   */
  public put(path: string, controller: string) {
    return this.applyMethod('put', path, controller)
  }

  /**
   * Define a route which will only work for delete method
   */
  public delete(path: string, controller: string) {
    return this.applyMethod('delete', path, controller)
  }

  /**
   * Define a route which will only work for patch method
   */
  public patch(path: string, controller: string) {
    return this.applyMethod('patch', path, controller)
  }

  /**
   * Define a route which will only work for options method
   */
  public options(path: string, controller: string) {
    return this.applyMethod('options', path, controller)
  }

  /**
   * Define a route which will only work for head method
   */
  public head(path: string, controller: string) {
    return this.applyMethod('head', path, controller)
  }
}
