# next-bundle-junoblocks

Map junoblocks npm package to use your local junoblocks clone and enable fast refresh on nextjs.

[![NPM](https://img.shields.io/npm/v/next-bundle-junoblocks.svg)](https://www.npmjs.com/package/next-bundle-junoblocks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add next-bundle-junoblocks
```

# Usage

1. Clone [junoblocks repo](https://github.com/sashimi36/junoblocks) in the same parent folder of your nextjs app. Here's an example of the folder structure.
```
  └── nextjs-app
  └──── node_modules
  └──── src
  └──── ...
  └── junoblocks
```
- Update `next.config.js` with the following:
```js 
// next.config.js
const withBundleJunoblocks = require('next-bundle-junoblocks')

module.exports = withBundleJunoblocks({});
```
- Run `yarn install && yarn dev` in junoblocks folder.
- Run `yarn dev` in your nextjs app.