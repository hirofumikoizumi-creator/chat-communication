# Chat Simulator Trainer - Deployment Guide

## Quick Start

This guide covers deploying the Chat Simulator Trainer iOS app to the App Store.

## Prerequisites Checklist

- [ ] Expo account created
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Apple Developer account active
- [ ] Google AdMob account with app created
- [ ] AdMob IDs configured in code
- [ ] App Store Connect account access

## Deployment Workflow

### Phase 1: Preparation (1-2 hours)

#### 1.1 Verify Code Quality

```bash
cd /home/ubuntu/chat-sim-trainer-native

# Install dependencies
npm install

# Check for errors
npm run lint  # if available
```

#### 1.2 Update Version

Edit `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

#### 1.3 Test Locally

```bash
# Test in development
npx expo start

# Press 'i' for iOS simulator
```

### Phase 2: Build (30-60 minutes)

#### 2.1 Authenticate

```bash
eas login
```

#### 2.2 Build for Production

```bash
eas build --platform ios --profile production
```

**Expected output:**
```
✓ Build created
✓ Build queued
✓ Build started
✓ Build completed
📱 Download link: https://...
```

#### 2.3 Monitor Build

```bash
# Check build status
eas build:list

# View build details
eas build:view <BUILD_ID>
```

### Phase 3: App Store Setup (1-2 hours)

#### 3.1 Create App in App Store Connect

1. Visit https://appstoreconnect.apple.com
2. Click "My Apps" → "+"
3. Fill in:
   - Platform: iOS
   - Name: Chat Simulator Trainer
   - Primary Language: English
   - Bundle ID: com.matchaiai.chatsimtrainer
   - SKU: chat-sim-trainer-001

#### 3.2 Fill App Information

**General Information:**
- Category: Games → Casual
- Content Rating: 12+
- Age Rating: 12+

**Pricing and Availability:**
- Price: Free
- Availability: Worldwide

**App Privacy:**
- Add privacy policy URL
- Declare data collection practices

#### 3.3 Prepare Screenshots

Create 5-7 screenshots (1170x2532 pixels):
1. Home screen with 4 characters
2. Character selection
3. Chat interface
4. Evaluation results
5. Score display

#### 3.4 Write App Description

**Name:** Chat Simulator Trainer

**Subtitle:** Practice Dating Conversations with AI

**Description:**
```
Chat Simulator Trainer helps you improve your dating conversation skills through interactive practice with AI characters.

Features:
• Chat with 4 AI characters (ages 18-32)
• 3 different conversation scenarios
• 4-dimension scoring system (Empathy, Questioning, Distance, Attractiveness)
• Detailed feedback and improvement suggestions
• Track your progress with conversation history

Perfect for:
• Dating app users wanting to improve social skills
• People practicing conversation in a safe environment
• Anyone looking to build confidence in dating conversations

Start practicing today and become a better conversationalist!
```

**Keywords:**
- Dating
- Conversation
- AI
- Practice
- Social skills
- Dating app
- Training

### Phase 4: Submit Build (5-10 minutes)

#### 4.1 Submit with EAS

```bash
eas submit --platform ios --latest
```

**Follow prompts:**
- Select "App Store Connect"
- Enter Apple ID
- Enter app-specific password (or use 2FA)

#### 4.2 Verify Submission

Check App Store Connect:
1. Go to "My Apps"
2. Select "Chat Simulator Trainer"
3. Go to "TestFlight" → "Build"
4. Verify build appears

### Phase 5: Review and Release (24-48 hours)

#### 5.1 Monitor Review Status

1. Check email for review updates
2. Monitor App Store Connect dashboard
3. Respond to any review questions

#### 5.2 Common Rejection Reasons

**Guideline 2.1 - App Completeness:**
- Ensure all features work
- Test all buttons and links

**Guideline 3.1 - Business:**
- Verify pricing is accurate
- Ensure no misleading claims

**Guideline 5.1 - Legal:**
- Include privacy policy
- Disclose data collection

#### 5.3 Release to App Store

Once approved:
1. Go to "App Store" → "Prepare for Submission"
2. Select build
3. Click "Add for Review" → "Submit for Review"
4. App goes live automatically

## Post-Launch

### 5.4 Monitor Performance

```bash
# Check crash reports
# View in App Store Connect → Analytics → Crashes

# Monitor ratings
# View in App Store Connect → Ratings and Reviews
```

### 5.5 Respond to Reviews

1. Check reviews daily
2. Respond to negative reviews professionally
3. Thank positive reviewers

### 5.6 Plan Updates

- Monitor crash reports
- Collect user feedback
- Plan feature updates
- Release updates quarterly

## Rollback Procedure

If issues occur after launch:

```bash
# Create new build with fix
eas build --platform ios --profile production

# Submit new build
eas submit --platform ios --latest

# Update App Store version
# In App Store Connect, select new build and submit
```

## Maintenance Schedule

**Weekly:**
- Monitor crash reports
- Check user reviews
- Verify ads are working

**Monthly:**
- Update dependencies
- Review analytics
- Plan next update

**Quarterly:**
- Major feature updates
- Performance optimization
- Security patches

## Configuration Files Reference

### app.json
```json
{
  "expo": {
    "name": "Chat Simulator Trainer",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.matchaiai.chatsimtrainer",
      "buildNumber": "1"
    }
  }
}
```

### eas.json
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
        "ascAppId": "YOUR_APP_ID",
        "appleId": "YOUR_EMAIL",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

## Troubleshooting

### Build Fails

**Error: "Certificate not found"**
- Regenerate provisioning profile
- Ensure Apple Developer account is active

**Error: "Build timeout"**
- Increase timeout in eas.json
- Try again with m1-medium resource class

### Submission Fails

**Error: "Invalid bundle ID"**
- Verify bundleIdentifier matches App Store Connect

**Error: "AdMob ID invalid"**
- Check AdMob IDs in app.json
- Ensure app is approved in AdMob

### App Rejected

**Common reasons:**
- Incomplete functionality
- Missing privacy policy
- Misleading screenshots
- Guideline violations

**Resolution:**
- Address feedback
- Update app
- Resubmit

## Support

- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer: https://developer.apple.com

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Preparation | 1-2 hours |
| Build | 30-60 min |
| App Store Setup | 1-2 hours |
| Submit | 5-10 min |
| Review | 24-48 hours |
| **Total** | **2-3 days** |

## Next Steps

1. Complete all prerequisites
2. Follow Phase 1-4 above
3. Monitor review process
4. Launch and promote app
5. Plan future updates
