/**
 * Entry Script
 */

if (process.env.NODE_ENV === 'production') {
  require('babel-polyfill');
  process.env.webpackAssets = JSON.stringify(require('./dist/client/manifest.json'));
  process.env.webpackChunkAssets = JSON.stringify(require('./dist/client/chunk-manifest.json'));
  // In production, serve the webpacked server file.
  require('./dist/server.bundle.js');
} else {
  // Babel polyfill to convert ES6 code in runtime
  require('babel-polyfill');
  require('babel-register')({
    "plugins": [
      [
        "babel-plugin-webpack-loaders",
        {
          "config": "./webpack.config.babel.js",
          "verbose": false
        }
      ]
    ]
  });
  require('./server/server');
}
