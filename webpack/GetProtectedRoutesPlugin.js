const fs = require('fs')
const webpack = require('webpack')

const files = []

class GetProtectedRoutesPlugin {
  constructor(options = {}) {
    this.options = options
    this.ok = false
  }

  apply(compiler) {
    compiler.hooks.emit.tap('GetProtectedRoutesPlugin', (compilation) => {
      compilation.modules.forEach((module) => {
        if (!module.resource?.endsWith('/route.ts')) return
        if (!fs.existsSync(module.resource)) return

        const content = fs.readFileSync(module.resource, 'utf-8')

        if (content.includes('// @protected')) {
          files.push(module.resource)
        }
      })

      console.log('01 >>>>>>>>>>', files)
    })

    const define = new webpack.DefinePlugin({
      'process.env.FILES_WITH_COMMENTS': JSON.stringify(files),
    })

    define.apply(compiler)
  }
}

module.exports = GetProtectedRoutesPlugin
