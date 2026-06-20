# iOS Build Instructions for Chat Simulator Trainer

## Overview

This guide provides step-by-step instructions for building and deploying the Chat Simulator Trainer iOS app using EAS Build.

## Prerequisites

Before starting, ensure you have:

1. **Expo Account**: Create at https://expo.dev
2. **EAS CLI**: Install globally with `npm install -g eas-cli`
3. **Apple Developer Account**: Required for iOS builds and App Store submission
4. **Google AdMob Account**: For ad integration (https://admob.google.com)

## Step 1: Prepare Your Environment

### 1.1 Install EAS CLI

```bash
npm install -g eas-cli
```

### 1.2 Authenticate with Expo

```bash
eas login
```

Enter your Expo credentials when prompted.

### 1.3 Initialize EAS Project

```bash
cd /home/ubuntu/chat-sim-trainer-native
eas init
```

This will:
- Link your Expo project
- Create a project ID
- Update `eas.json`

## Step 2: Configure AdMob

### 2.1 Create AdMob App

1. Visit https://admob.google.com
2. Sign in with your Google account
3. Click "Apps" → "Add app"
4. Select "iOS"
5. Enter app name: "Chat Simulator Trainer"
6. Create the app

### 2.2 Generate Ad Unit IDs

For each ad format:

**Banner Ads:**
1. Click "Ad units" → "Create ad unit"
2. Select "Banner"
3. Name: "HomeScreenBanner"
4. Copy the Ad Unit ID

**Interstitial Ads:**
1. Click "Ad units" → "Create ad unit"
2. Select "Interstitial"
3. Name: "ResultsScreenInterstitial"
4. Copy the Ad Unit ID

### 2.3 Get App ID

1. In AdMob, go to "Apps"
2. Find your iOS app
3. Copy the "App ID" (format: `ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyyyyyy`)

### 2.4 Update Configuration

Update `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "ios_app_id": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyyyyyy"
        }
      ]
    ]
  }
}
```

Update `src/hooks/useAds.ts`:
```typescript
const BANNER_AD_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const INTERSTITIAL_AD_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy';
```

## Step 3: Configure Apple Developer

### 3.1 Create App ID

1. Visit https://developer.apple.com
2. Go to "Certificates, Identifiers & Profiles"
3. Click "Identifiers" → "+"
4. Select "App IDs"
5. Enter:
   - App Name: "Chat Simulator Trainer"
   - Bundle ID: `com.matchaiai.chatsimtrainer`
6. Click "Continue" → "Register"

### 3.2 Create Provisioning Profile

1. Go to "Provisioning Profiles" → "+"
2. Select "iOS App Development"
3. Select your App ID
4. Select your certificate
5. Name: "Chat Simulator Trainer Development"
6. Download and install

### 3.3 Update eas.json

```json
{
  "build": {
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleId": "your-apple-id@example.com",
        "appleTeamId": "YOUR_TEAM_ID",
        "bundleIdentifier": "com.matchaiai.chatsimtrainer"
      }
    }
  }
}
```

## Step 4: Build for iOS

### 4.1 Development Build

For testing on simulator:

```bash
eas build --platform ios --profile development
```

### 4.2 Production Build

For App Store submission:

```bash
eas build --platform ios --profile production
```

This will:
- Build the iOS app in the cloud
- Generate an IPA file
- Provide a download link
- Show build status in terminal

### 4.3 Monitor Build

View build status:
```bash
eas build:list
```

View build logs:
```bash
eas build:view <BUILD_ID>
```

## Step 5: Test the Build

### 5.1 Download IPA

1. Wait for build to complete
2. Click the download link provided by EAS
3. Or download from: https://expo.dev/builds

### 5.2 Install on Device

Using Xcode:
```bash
xcrun simctl install booted /path/to/app.ipa
```

Or use TestFlight for beta testing.

## Step 6: Submit to App Store

### 6.1 Prepare App Store Connect

1. Visit https://appstoreconnect.apple.com
2. Click "My Apps" → "+"
3. Create new app:
   - Platform: iOS
   - Name: "Chat Simulator Trainer"
   - Bundle ID: `com.matchaiai.chatsimtrainer`
   - SKU: `chat-sim-trainer-001`

### 6.2 Fill App Information

1. General Information
   - Category: Games
   - Subcategory: Casual
   - Content Rating: 12+

2. Pricing and Availability
   - Price: Free
   - Availability: Worldwide

3. Screenshots
   - Upload 5-7 screenshots (1170x2532 pixels)
   - Show key features

4. Description
   - Write compelling app description
   - Include key features
   - Add keywords for search

### 6.3 Submit Build

```bash
eas submit --platform ios --latest
```

Or specify a build:
```bash
eas submit --platform ios --id <BUILD_ID>
```

### 6.4 Review Process

1. Apple reviews the app (typically 24-48 hours)
2. You'll receive email notification
3. If approved, app goes live on App Store
4. If rejected, address feedback and resubmit

## Troubleshooting

### Build Errors

**CocoaPods error**:
```bash
cd ios && pod install && cd ..
```

**Build timeout**:
- Increase timeout in `eas.json`
- Use `m1-medium` resource class

**Certificate error**:
- Ensure Apple Developer account is active
- Check certificate expiration date
- Regenerate provisioning profile

### Submission Errors

**Bundle ID mismatch**:
- Ensure `bundleIdentifier` in `app.json` matches App Store Connect

**Ad ID issues**:
- Verify AdMob IDs are correct
- Ensure app is approved in AdMob

**Privacy policy missing**:
- Add privacy policy URL in App Store Connect

## Next Steps

1. Monitor app performance in App Store Connect
2. Respond to user reviews
3. Plan updates and new features
4. Consider premium features or subscriptions

## Support Resources

- Expo Build Docs: https://docs.expo.dev/build/introduction/
- EAS Submit Docs: https://docs.expo.dev/submit/introduction/
- App Store Connect Help: https://help.apple.com/app-store-connect/
- AdMob Help: https://support.google.com/admob/

## Important Notes

- Keep your Apple ID and Team ID confidential
- Regularly update dependencies and security patches
- Monitor app crashes and user feedback
- Plan for regular updates (at least quarterly)
- Test thoroughly before each submission
