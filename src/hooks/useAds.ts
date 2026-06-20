import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

// AdMob IDs（テスト用）
// 実際のアプリでは、以下を実際の Ad Unit ID に置き換えてください
const BANNER_AD_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy'; // Replace with your Banner Ad ID
const INTERSTITIAL_AD_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy'; // Replace with your Interstitial Ad ID

// ネイティブ専用のインポート
let InterstitialAd: any = null;
let AdEventType: any = null;

if (Platform.OS !== 'web') {
  try {
    const googleMobileAds = require('react-native-google-mobile-ads');
    InterstitialAd = googleMobileAds.InterstitialAd;
    AdEventType = googleMobileAds.AdEventType;
  } catch (error) {
    console.warn('Google Mobile Ads not available:', error);
  }
}

export const useBannerAd = () => {
  const showBannerAd = useCallback(() => {
    // バナー広告の表示ロジック
    // Web では何もしない
    if (Platform.OS === 'web') {
      console.log('Banner ad (Web - skipped)');
      return;
    }
    console.log('Banner ad shown');
  }, []);

  return { showBannerAd };
};

export const useInterstitialAd = () => {
  const interstitialRef = useCallback(() => null, []);

  useEffect(() => {
    if (Platform.OS === 'web' || !InterstitialAd) {
      return;
    }

    const loadInterstitialAd = () => {
      try {
        const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_ID);

        const unsubscribeLoaded = interstitial.addAdEventListener(
          AdEventType.LOADED,
          () => {
            console.log('Interstitial ad loaded');
          }
        );

        const unsubscribeError = interstitial.addAdEventListener(
          AdEventType.ERROR,
          (error: any) => {
            console.error('Interstitial ad error:', error);
          }
        );

        interstitial.load();

        return () => {
          unsubscribeLoaded();
          unsubscribeError();
        };
      } catch (error) {
        console.error('Failed to load interstitial ad:', error);
      }
    };

    return loadInterstitialAd();
  }, []);

  const showInterstitialAd = useCallback(async () => {
    if (Platform.OS === 'web' || !InterstitialAd) {
      console.log('Interstitial ad (Web - skipped)');
      return;
    }

    try {
      // 実装は後で
      console.log('Interstitial ad shown');
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    }
  }, []);

  return { showInterstitialAd };
};
