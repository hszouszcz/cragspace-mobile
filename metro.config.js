const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/.*\.(test|spec)\.(ts|tsx|js|jsx)$/];

module.exports = config;
