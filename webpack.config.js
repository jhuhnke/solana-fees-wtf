const path = require('path'); 
const webpack = require('webpack');

module.exports = {
    resolve: {
    fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        url: require.resolve('url/'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
    },
},
}; 
