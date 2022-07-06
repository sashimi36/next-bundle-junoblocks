const fs = require('fs')
const path = require('path')
const clc = require('cli-color')

function withBundleJunoblocksInitializer(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      try {
        const __project_dir = path.resolve(process.cwd(), './')
        const __junoblocks_dir = path.resolve(__project_dir, '../junoblocks')

        if (!fs.existsSync(__junoblocks_dir)) {
          throw new Error('Junoblocks not found')
        }

        /* point to the junoblocks in every import */
        config.resolve.alias.junoblocks = __junoblocks_dir

        /* take precedence of junoblocks packages first */
        config.resolve.modules.unshift(__junoblocks_dir)
        config.resolve.modules.unshift(
          path.resolve(__junoblocks_dir, './node_modules')
        )
      } catch (err) {
        logBundlerError(err)
      }

      // Overload the Webpack config if it was already overloaded
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
}

module.exports = (config) => {
  if (process.env.NODE_ENV === 'development') {
    return withBundleJunoblocksInitializer(config)
  }

  return config
}

function logBundlerError(err) {
  console.log('')
  console.log(
    clc.red(
      '[junoblocks] Could not bundle up junoblocks with next. Forgot to clone junoblocks repo?'
    )
  )
  console.log('')
  console.log(clc.yellowBright('[junoblocks]'), 'Follow this file tree:')
  console.log('             └── your_project')
  console.log('             └────── node_modules')
  console.log('             └────── index.js')
  console.log('             └────── ...')
  console.log('             └──', clc.yellowBright('junoblocks'))
  console.log('             └────── dist')
  console.log('             └────── index.js')
  console.log('')
  console.log(
    clc.yellowBright('[junoblocks]'),
    'Start junoblocks dev bundler too:'
  )
  console.log('             cd junoblocks && yarn install && yarn dev')
  console.log('')
  console.log(err)
}
