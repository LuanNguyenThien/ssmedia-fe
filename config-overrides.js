const { aliasWebpack, aliasJest } = require('react-app-alias');

const aliasMap = {
  '@components': 'src/components',
  '@services': 'src/services',
  '@hooks': 'src/hooks',
  '@pages': 'src/pages',
  '@mocks': 'src/mocks',
  '@assets': 'src/assets',
  '@colors': 'src/colors',
  '@redux': 'src/redux-toolkit',
  '@root': 'src'
};

const options = {
  alias: aliasMap
};

const override = aliasWebpack(options);
module.exports = function(config) {
  // First apply the aliases
  const newConfig = override(config);
  
  // Then add fallback for crypto
  newConfig.resolve.fallback = {
    ...newConfig.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "vm": require.resolve("vm-browserify")
  };
  
  return newConfig;
};

module.exports.jest = aliasJest(options);