import express from 'express'
import morgan from 'morgan'

import { NODE_ENV, PORT } from 'src/config'
import { router } from 'src/routes'

class App {
  public app: express.Application
  public env: string
  public port: string | number

  constructor() {
    this.env = NODE_ENV || 'development'
    this.port = PORT || 3000
  }

  /**
   * Function to initialize web-server.
   * Initializes all the middlewares, routes & whole express server.
   */
  public initializeServer() {
    this.app = express()
    this.initialize()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
    this.listen()

    return this
  }

  /**
   * Function to initialize repl
   */
  public initializeRepl() {
    this.initialize()

    return this
  }

  /**
   * Function which initializes things common to both
   * repl & web-server.
   */
  private initialize() {
    require('src/models/client')
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`)
      console.log(`======= ENV: ${this.env} =======`)
      console.log(`🚀 App listening on the port ${this.port}`)
      console.log(`=================================`)
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(morgan('dev'))
    this.app.use(express.json({}))
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRoutes() {
    this.app.use(router.initialize())
  }

  private initializeErrorHandling() {
    // this.app.use(ErrorMiddleware);
  }
}

export default App
