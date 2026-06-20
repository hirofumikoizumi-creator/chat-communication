// Web 環境用の Google Mobile Ads モック
module.exports = {
  default: () => Promise.resolve(),
  InterstitialAd: {
    createForAdRequest: () => ({
      load: () => {},
      show: () => Promise.resolve(),
      addAdEventListener: () => () => {},
    }),
  },
  AdEventType: {
    LOADED: 'LOADED',
    ERROR: 'ERROR',
  },
  BannerAd: {
    createForAdRequest: () => ({
      load: () => {},
      addAdEventListener: () => () => {},
    }),
  },
};
