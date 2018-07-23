var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MAPBOX_ACCESS_TOKEN: '"<enter credentials here, keep both quote marks>"',
  MAPBOX_STYLE_REGULAR: '"<enter credentials here, keep both quote marks>"',
  MAPBOX_STYLE_LIGHT: '"<enter credentials here, keep both quote marks>"',
  FIREBASE_API_KEY: '"<enter credentials here, keep both quote marks>"',
  FIREBASE_AUTH_DOMAIN: '"<enter credentials here, keep both quote marks>"',
  FIREBASE_DATABASE_URL: '"<enter credentials here, keep both quote marks>"',
  FIREBASE_STORAGE_BUCKET: '"<enter credentials here, keep both quote marks>"',
  FIREBASE_MESSAGING_SENDER_ID: '"<enter credentials here, keep both quote marks>"'
})
