import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
// import { useBannerAd } from '@/src/hooks/useAds';

export default function HomeScreen() {
  const router = useRouter();
  // const { showBannerAd } = useBannerAd();
  // useEffect(() => {
  //   showBannerAd();
  // }, []);

  const characters = [
    { id: 'yui', name: 'ゆい', age: 18, emoji: '👧', role: '高校生', color: '#FFB6D9' },
    { id: 'sakura', name: 'さくら', age: 23, emoji: '👩', role: '社会人1年目', color: '#FFD699' },
    { id: 'misaki', name: 'みさき', age: 27, emoji: '👩‍💼', role: 'OL', color: '#FFEB99' },
    { id: 'nana', name: 'なな', age: 32, emoji: '👩‍🦰', role: '大人女子', color: '#D4FFB6' },
  ];

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
          {characters.map((character) => (
            <TouchableOpacity
              key={character.id}
              style={[styles.characterCard, { backgroundColor: character.color }]}
              onPress={() => router.push({
                pathname: '/character-detail',
                params: { characterId: character.id },
              })}
            >
              <Text style={styles.characterEmoji}>{character.emoji}</Text>
              <Text style={styles.characterName}>{character.name} ({character.age})</Text>
              <Text style={styles.characterRole}>{character.role}</Text>
            </TouchableOpacity>
          ))}
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
          onPress={() => router.push('/history')}
        >
          <Text style={styles.historyButtonText}>📜 過去の会話履歴を見る</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
