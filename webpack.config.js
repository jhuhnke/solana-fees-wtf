const path = require('path');

module.exports = {
  // other configurations like entry, output, etc.

  resolve: {
    fallback: {
      "http": false,
      "https": false,
      "zlib": require.resolve('browserify-zlib'),
      "url": require.resolve('url/'),
      "path": require.resolve('path-browserify'),
      "os": require.resolve('os-browserify/browser'),
      "crypto": require.resolve('crypto-browserify'),
      'stream': require.resolve('stream-browserify'),
      "process": require.resolve('process/browser'),
    }
  },
  // loaders and other configurations...
};

