import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useBannerAd } from '../hooks/useAds';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { showBannerAd } = useBannerAd();

  useEffect(() => {
    showBannerAd();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>💬 チャットシミュレーター</Text>
          <Text style={styles.subtitle}>AI女性との会話練習で恋愛スキルをアップ</Text>
        </View>

        {/* 4キャラクター紹介 */}
        <View style={styles.charactersSection}>
          <Text style={styles.sectionTitle}>キャラクターを選択</Text>
          <TouchableOpacity
            style={[styles.characterCard, { backgroundColor: '#FFB6D9' }]}
            onPress={() => navigation.navigate('CharacterDetail', { characterId: 'yui' })}
          >
            <Text style={styles.characterEmoji}>👧</Text>
            <Text style={styles.characterName}>ゆい (18)</Text>
            <Text style={styles.characterRole}>高校生</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.characterCard, { backgroundColor: '#FFD699' }]}
            onPress={() => navigation.navigate('CharacterDetail', { characterId: 'sakura' })}
          >
            <Text style={styles.characterEmoji}>👩</Text>
            <Text style={styles.characterName}>さくら (23)</Text>
            <Text style={styles.characterRole}>社会人1年目</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.characterCard, { backgroundColor: '#FFEB99' }]}
            onPress={() => navigation.navigate('CharacterDetail', { characterId: 'misaki' })}
          >
            <Text style={styles.characterEmoji}>👩‍💼</Text>
            <Text style={styles.characterName}>みさき (27)</Text>
            <Text style={styles.characterRole}>OL</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.characterCard, { backgroundColor: '#D4FFB6' }]}
            onPress={() => navigation.navigate('CharacterDetail', { characterId: 'nana' })}
          >
            <Text style={styles.characterEmoji}>👩‍🦰</Text>
            <Text style={styles.characterName}>なな (32)</Text>
            <Text style={styles.characterRole}>大人女子</Text>
          </TouchableOpacity>
        </View>

        {/* 機能紹介 */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>アプリの特徴</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🤖</Text>
            <Text style={styles.featureText}>AI女性とリアルな会話練習</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Text style={styles.featureText}>4軸スコア評価（共感力・質問力・距離感・魅力度）</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🏆</Text>
            <Text style={styles.featureText}>S〜Dランク判定</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>💡</Text>
            <Text style={styles.featureText}>具体的なフィードバック</Text>
          </View>
        </View>

        {/* 履歴へのリンク */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.historyButtonText}>📜 過去の会話履歴を見る</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  charactersSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  characterCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  characterRole: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  featuresSection: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  historyButton: {
    backgroundColor: '#FF9999',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
