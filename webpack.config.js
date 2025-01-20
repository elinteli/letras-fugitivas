const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
    },
  },
  // Otras configuraciones...
};
