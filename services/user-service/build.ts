import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

async function build() {
  if (fs.existsSync(path.join(__dirname, 'build'))) {
    await fs.promises.rm(path.join(__dirname, 'build'), {
      recursive: true,
    })
  }

  await promisify(exec)(`tsc --build . && tsc-alias`)
}

build()
