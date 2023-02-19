import { Repl } from '@adonisjs/repl/build/standalone'
import { join } from 'path'

import App from 'src/app'
import { APP_ROOT } from 'src/config'

const compiler = global[Symbol.for('REQUIRE_TS_COMPILER')]

const repl = new Repl(
  compiler,
  join(APP_ROOT, '..', 'node_modules', '.adonis_repl_history')
)

repl.ready((repl) => {
  // initialize the app (database & other functionalities when repl is ready)
  repl.server.context.app = new App()
  repl.server.context.app.initialize().then(() => {
    require('src/controllers/Public/EventsController')
  })
})

// add helpers to help the developer
repl.addMethod(
  'loadPrisma',
  () => {
    return (repl.server.context.prisma =
      require(`${APP_ROOT}/prismaClient`).prisma)
  },
  {
    description: 'Load the prisma client & store it in `prisma` variable',
  }
)

repl.addMethod(
  'loadHelpers',
  () => {
    return (repl.server.context.helpers = require(`${APP_ROOT}/helpers`))
  },
  {
    description: 'Load all helpers & store them in `helpers` variable',
  }
)

// start the repl
repl.start()
