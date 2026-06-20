const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Web 向けにネイティブ専用モジュールをモック
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

// Web プラットフォーム用の設定
const originalResolveRequest = config.resolver.resolveRequest;
if (originalResolveRequest) {
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Web プラットフォームでネイティブ専用モジュールをモック
    if (platform === 'web' && moduleName === 'react-native-google-mobile-ads') {
      return {
        filePath: require.resolve('./src/mocks/google-mobile-ads-mock.js'),
        type: 'sourceFile',
      };
    }
    return originalResolveRequest(context, moduleName, platform);
  };
}

module.exports = config;
