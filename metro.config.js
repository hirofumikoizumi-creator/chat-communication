const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Web 向けにネイティブ専用モジュールをモック
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@': __dirname,
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Web プラットフォームでネイティブ専用モジュールをモック
  if (platform === 'web' && moduleName === 'react-native-google-mobile-ads') {
    return {
      filePath: require.resolve('./src/mocks/google-mobile-ads-mock.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName.startsWith('@/')) {
    return context.resolveRequest(
      context,
      path.join(__dirname, moduleName.slice(2)),
      platform
    );
  }
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
