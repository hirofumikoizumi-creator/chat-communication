import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

export default function RootLayout() {
  useEffect(() => {
    // Initialize Google Mobile Ads (native only)
    if (Platform.OS !== 'web') {
      try {
        const mobileAds = require('react-native-google-mobile-ads').default;
        mobileAds()
          .then(() => console.log('Google Mobile Ads initialized'))
          .catch((error) => console.error('Failed to initialize Google Mobile Ads:', error));
      } catch (error) {
        console.warn('Google Mobile Ads not available');
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'ホーム' }} />
        <Stack.Screen name="character-detail" options={{ title: 'キャラクター選択' }} />
        <Stack.Screen name="chat" options={{ title: 'チャット' }} />
        <Stack.Screen name="results" options={{ title: '評価結果' }} />
        <Stack.Screen name="history" options={{ title: '履歴' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
