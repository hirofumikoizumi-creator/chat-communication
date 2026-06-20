# Chat Simulator Trainer - iOS Native App Setup Guide

## Overview

This is a native iOS application built with Expo and React Native for practicing dating conversation skills with AI characters. The app features 4 AI characters, 3 conversation scenarios, 4-dimension scoring, and Google AdMob integration.

## Project Structure

```
/home/ubuntu/chat-sim-trainer-native/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CharacterDetailScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── data/
│   │   ├── characters.ts
│   │   └── scenarios.ts
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   └── chatStore.ts
│   └── hooks/
│       └── useAds.ts
├── App.tsx
├── app.json
├── eas.json
└── package.json
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Apple Developer Account (for iOS builds)
- Google AdMob Account (for ad IDs)

## Setup Steps

### 1. Install Dependencies

```bash
cd /home/ubuntu/chat-sim-trainer-native
npm install
```

### 2. Configure Google AdMob

1. Visit https://admob.google.com
2. Create an iOS app in AdMob
3. Generate Ad Unit IDs for:
   - Banner Ads (320x50 or 300x250)
   - Interstitial Ads (full screen)
4. Update the IDs in:
   - `src/hooks/useAds.ts` (BANNER_AD_ID, INTERSTITIAL_AD_ID)
   - `app.json` (ios_app_id, android_app_id)

### 3. Configure EAS Build

```bash
eas init
```

This will:
- Create an Expo project link
- Generate a project ID
- Update `eas.json`

Then update `eas.json` with your Apple Developer credentials:
```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "YOUR_APP_ID",
        "appleId": "YOUR_APPLE_ID",
        "appleTeamId": "YOUR_TEAM_ID",
        "bundleIdentifier": "com.matchaiai.chatsimtrainer"
      }
    }
  }
}
```

### 4. Development

Run the development server:
```bash
npx expo start
```

Press `i` to open in iOS simulator.

### 5. Build for iOS

#### Option A: EAS Build (Recommended)

```bash
eas login
eas build --platform ios --profile production
```

This will:
- Build the iOS app in the cloud
- Generate an IPA file
- Provide a download link

#### Option B: Local Build

```bash
npx expo run:ios
```

This requires Xcode and CocoaPods to be installed.

### 6. Submit to App Store

```bash
eas submit --platform ios --latest
```

This will submit the latest build to the App Store for review.

## Configuration Files

### app.json

- **name**: App name displayed on home screen
- **slug**: URL-friendly app identifier
- **bundleIdentifier**: iOS bundle ID
- **ios_app_id**: Google AdMob iOS App ID

### eas.json

- **resourceClass**: Build machine type (m1-medium for faster builds)
- **distribution**: internal or store
- **ascAppId**: App Store Connect App ID
- **appleTeamId**: Apple Developer Team ID

### src/services/api.ts

- **API_BASE_URL**: Backend API endpoint (currently set to Manus-hosted backend)

## Features Implemented

### Screens

1. **HomeScreen**: Main screen with 4 character cards and feature overview
2. **CharacterDetailScreen**: Character info and scenario selection
3. **ChatScreen**: Real-time chat interface with AI
4. **ResultsScreen**: Evaluation results with 4-dimension scoring
5. **HistoryScreen**: Past conversation history

### Data

- **Characters**: Yui (18), Sakura (23), Misaki (27), Nana (32)
- **Scenarios**: First message, Continuing conversation, Date invitation
- **Scoring**: Empathy, Questioning, Distance, Attractiveness (0-100)
- **Ranking**: S, A, B, C, D

### Ads

- **Banner Ads**: Displayed on home and history screens
- **Interstitial Ads**: Shown after evaluation results

## API Integration

The app communicates with the backend at:
```
https://matchaiai-iizcntga.manus.space/api/trpc
```

Endpoints:
- `chat.sendMessage`: Send message and get AI response
- `chat.evaluateSession`: Evaluate conversation
- `session.create`: Create new session
- `session.list`: Get past sessions
- `session.getById`: Get session details

## Design System

- **Background**: Peach (#FFF4E6)
- **Character Colors**: Pink, Yellow, Orange, Green
- **Accent**: Red (#FF9999), Blue (#99CCFF)
- **Typography**: Bold headers, regular body text
- **Spacing**: 16px base unit
- **Border Radius**: 12-16px for cards

## Troubleshooting

### Build Errors

**CocoaPods error**:
```bash
cd ios && pod install && cd ..
```

**EAS auth error**:
```bash
eas logout
eas login
```

### Runtime Errors

**API connection error**: Check `src/services/api.ts` for correct backend URL

**Ads not showing**: Verify AdMob IDs in `app.json` and `src/hooks/useAds.ts`

**Navigation issues**: Ensure screen names match in `App.tsx`

## Next Steps

1. Customize AdMob IDs with your own credentials
2. Test the app in iOS simulator
3. Build with EAS: `eas build --platform ios --profile production`
4. Submit to App Store: `eas submit --platform ios --latest`
5. Monitor app performance in App Store Connect

## Support

For issues or questions, refer to:
- Expo Documentation: https://docs.expo.dev
- EAS Build Guide: https://docs.expo.dev/build/introduction/
- React Native Docs: https://reactnative.dev
