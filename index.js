const fs = require('fs')
const path = require('path')
const clc = require('cli-color')

const withTM = require('next-transpile-modules')(['junoblocks'], {
  resolveSymlinks: false,
})

function withBundleJunoblocksInitializer(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      try {
        const __project_dir = path.resolve(process.cwd(), './')
        const __junoblocks_dir = path.resolve(__project_dir, '../junoblocks')

        if (!fs.existsSync(__junoblocks_dir)) {
          throw new Error('Junoblocks not found')
        }

        config.resolve.alias.junoblocks = __junoblocks_dir

        const peerDependencies = Object.keys(
          require(`${__junoblocks_dir}/package.json`).peerDependencies
        )

        peerDependencies.forEach((dependencyName) => {
          config.resolve.alias[dependencyName] = path.resolve(
            __project_dir,
            `./node_modules/${dependencyName}`
          )
        })
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
    return withTM(withBundleJunoblocksInitializer(config))
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
