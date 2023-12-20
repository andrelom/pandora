const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

class DefineRoutesPlugin {
  constructor(predicate) {
    this.predicate = predicate
  }

  apply(compiler) {
    const id = this.predicate.toUpperCase()
    const files = this.#getFiles(compiler.context)
    const routes = this.#getRoutes(files)

    const define = new webpack.DefinePlugin({
      [`process.env.${id}_ROUTES`]: JSON.stringify(routes),
    })

    define.apply(compiler)
  }

  #getRoutes(files) {
    const routes = []

    for (const file of files) {
      if (!file.endsWith('route.ts')) continue
      if (!fs.existsSync(file)) continue

      const source = fs.readFileSync(file, 'utf-8')

      if (!source.includes(`'use ${this.predicate}'`)) continue

      const match = file.replace(/\\+/gi, '/').match(/\/app\/(.*?)\/route\.ts/i)
      const route = match ? `/${match[1]}` : ''

      if (route) {
        routes.push(route)
      }
    }

    return routes
  }

  #getFiles(root, files = []) {
    if (/node_modules|\.next/gi.test(root)) return files

    for (const name of fs.readdirSync(root)) {
      const file = path.join(root, name)
      const stat = fs.statSync(file)

      if (!stat.isDirectory()) {
        files.push(file)
      } else {
        this.#getFiles(file, files)
      }
    }

    return files
  }
}

module.exports = DefineRoutesPlugin