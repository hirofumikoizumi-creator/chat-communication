import { Platform } from 'react-native';
import {
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import { ADMOB } from '@/src/config/ads';

const AD_TIMEOUT_MS = 8000;

export const showEvaluationInterstitial = async () => {
  if (Platform.OS === 'web') {
    return;
  }

  await new Promise<void>((resolve) => {
    let resolved = false;
    let unsubscribeLoaded = () => {};
    let unsubscribeClosed = () => {};
    let unsubscribeError = () => {};
    const interstitial = InterstitialAd.createForAdRequest(ADMOB.interstitialMain, {
      requestNonPersonalizedAdsOnly: false,
    });

    const finish = () => {
      if (!resolved) {
        resolved = true;
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        resolve();
      }
    };

    const timeout = setTimeout(finish, AD_TIMEOUT_MS);
    unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, async () => {
      clearTimeout(timeout);
      try {
        await interstitial.show();
      } catch {
        finish();
      }
    });
    unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, finish);
    unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, finish);

    interstitial.load();
  });
};
