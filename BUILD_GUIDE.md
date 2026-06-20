# 恋愛会話AIトレーナー - iOS ビルド準備ガイド

**アプリ名**: 恋愛会話AIトレーナー  
**Bundle ID**: `com.matchaiai.chatsimtrainer`  
**バージョン**: 1.0.0

---

## 📋 iOS ビルド前の準備チェックリスト

### 1. App Store Connect でアプリを作成

**手順:**
1. https://appstoreconnect.apple.com にアクセス
2. 「My Apps」→ 「+」ボタン
3. 「New App」を選択
4. 以下を入力:
   - **Platform**: iOS
   - **Name**: 恋愛会話AIトレーナー
   - **Primary Language**: Japanese
   - **Bundle ID**: `com.matchaiai.chatsimtrainer`
   - **SKU**: `love-chat-ai-trainer-001`
   - **User Access**: Full Access

5. 「Create」をクリック

**取得する情報:**
- [ ] App ID: `XXXXXXXXXX`
- [ ] Bundle ID: `com.matchaiai.chatsimtrainer`

---

### 2. Google AdMob でアプリを登録

**手順:**
1. https://admob.google.com にアクセス
2. 「アプリ」タブ → 「アプリを追加」
3. 以下を入力:
   - **アプリ名**: 恋愛会話AIトレーナー
   - **プラットフォーム**: iOS
   - **ストア**: Apple App Store
   - **アプリのカテゴリ**: ゲーム > 教育

4. アプリを登録後、Ad Unit を作成:
   - **Banner Ad Unit** (320x50)
   - **Interstitial Ad Unit** (全画面)

**取得する情報:**
- [ ] iOS App ID: `ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyyyyyy`
- [ ] Banner Ad Unit ID: `ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy`
- [ ] Interstitial Ad Unit ID: `ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy`

---

### 3. Apple Developer で証明書を作成

**手順:**
1. https://developer.apple.com にアクセス
2. 「Certificates, Identifiers & Profiles」に移動
3. 「Identifiers」で App ID を作成:
   - **Identifier**: `com.matchaiai.chatsimtrainer`
   - **Capabilities**: Push Notifications (オプション)

4. 「Certificates」で Distribution Certificate を作成

**取得する情報:**
- [ ] Team ID: `XXXXXXXXXX`
- [ ] App ID: `com.matchaiai.chatsimtrainer`

---

### 4. 設定ファイルを更新

#### `app.json` を更新

```json
{
  "expo": {
    "name": "恋愛会話AIトレーナー",
    "slug": "love-chat-ai-trainer",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.matchaiai.chatsimtrainer",
      "buildNumber": "1"
    },
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

#### `src/hooks/useAds.ts` を更新

```typescript
const BANNER_AD_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const INTERSTITIAL_AD_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy';
```

#### `eas.json` を更新

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
        "ascAppId": "XXXXXXXXXX",
        "appleId": "your-email@example.com",
        "appleTeamId": "XXXXXXXXXX",
        "appleIdPassword": "@keychain:ASC_PASSWORD"
      }
    }
  }
}
```

---

## 🚀 iOS ビルド実行手順

### Step 1: EAS にログイン

```bash
cd /home/ubuntu/chat-sim-trainer-native
eas login
```

**入力:**
- Expo メールアドレス
- パスワード

### Step 2: iOS ビルド実行

```bash
eas build --platform ios --profile production
```

**ビルド中:**
- ビルドプロセスが開始
- 完了までに 10-20 分程度かかります

### Step 3: ビルド完了確認

```bash
eas build:list
```

ビルドが成功したら、ダウンロードリンクが表示されます。

---

## 📤 App Store に提出

### Step 1: App Store Connect で基本情報を入力

1. https://appstoreconnect.apple.com にアクセス
2. アプリを選択
3. 以下を入力:
   - **説明**: アプリの説明文
   - **キーワード**: 恋愛, AI, 会話, トレーニング
   - **サポート URL**: https://matchaiai.com/support
   - **プライバシーポリシー URL**: https://matchaiai.com/privacy
   - **スクリーンショット**: 5 枚以上（iPhone 6.7 インチ）
   - **プレビュー動画**: (オプション)

### Step 2: アプリレビュー情報を入力

1. **App Review Information**:
   - **デモアカウント**: (必要に応じて)
   - **ノート**: アプリの説明

### Step 3: ビルドを選択

1. 「Build」セクションで、ビルドを選択
2. 「Save」をクリック

### Step 4: 提出

```bash
eas submit --platform ios --latest
```

または、App Store Connect から手動で提出

---

## 📋 提出前チェックリスト

- [ ] App Store Connect でアプリを作成
- [ ] Google AdMob でアプリを登録
- [ ] Ad Unit ID を取得
- [ ] `app.json` を更新
- [ ] `src/hooks/useAds.ts` を更新
- [ ] `eas.json` を更新
- [ ] EAS にログイン
- [ ] iOS ビルド実行
- [ ] ビルド成功を確認
- [ ] App Store Connect で基本情報を入力
- [ ] スクリーンショットをアップロード
- [ ] 提出

---

## 🔍 トラブルシューティング

### ビルドが失敗した場合

```bash
# ビルドログを確認
eas build:view <build-id>

# キャッシュをクリアして再試行
eas build --platform ios --profile production --clear-cache
```

### App Store Connect で拒否された場合

1. **拒否理由を確認**
2. **問題を修正**
3. **新しいビルドを提出**

---

## 📞 サポート

- **Expo**: https://docs.expo.dev/
- **App Store Connect**: https://help.apple.com/app-store-connect/
- **Google AdMob**: https://support.google.com/admob/

---

## 次のステップ

1. 上記の情報を集めて、設定ファイルを更新
2. EAS ビルド実行
3. App Store 提出
4. アプリレビュー待機（通常 1-3 日）
5. App Store に公開

**推定時間**: 2-3 日（レビュー待機を含む）
