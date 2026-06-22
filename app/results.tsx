import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChatStore } from '@/src/store/chatStore';
import { chatAPI, EvaluationResult } from '@/src/services/api';
import { getCharacterById } from '@/src/data/characters';
// import { useInterstitialAd } from '@/src/hooks/useAds';

const getRankColor = (rank: string): string => {
  switch (rank) {
    case 'S':
      return '#FFD700';
    case 'A':
      return '#FF9999';
    case 'B':
      return '#99CCFF';
    case 'C':
      return '#99FF99';
    case 'D':
      return '#CCCCCC';
    default:
      return '#FFFFFF';
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#FFD700';
  if (score >= 60) return '#FF9999';
  if (score >= 40) return '#99CCFF';
  return '#CCCCCC';
};

export default function ResultsScreen() {
  const router = useRouter();
  const { sessionId, characterId, scenarioId } = useLocalSearchParams<{
    sessionId: string;
    characterId: string;
    scenarioId?: string;
  }>();
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { messages } = useChatStore();
  const character = characterId ? getCharacterById(characterId) : null;
  // const { showInterstitialAd } = useInterstitialAd();

  useEffect(() => {
    fetchEvaluation();
    // showInterstitialAd();
  }, []);

  const fetchEvaluation = async () => {
    try {
      setIsLoading(true);
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await chatAPI.evaluateSession(
        sessionId || '',
        characterId || '',
        scenarioId || '',
        conversationHistory
      );

      setEvaluation(result);
    } catch (error) {
      console.error('Evaluation fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9999" />
          <Text style={styles.loadingText}>評価中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!evaluation) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>評価の取得に失敗しました</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ランク表示 */}
        <View style={[styles.rankCard, { backgroundColor: getRankColor(evaluation.rank) }]}>
          <Text style={styles.rankLabel}>ランク</Text>
          <Text style={styles.rankValue}>{evaluation.rank}</Text>
        </View>

        {/* スコア表示 */}
        <View style={styles.scoresSection}>
          <Text style={styles.sectionTitle}>4軸スコア</Text>

          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>共感力</Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${evaluation.empathy}%`,
                    backgroundColor: getScoreColor(evaluation.empathy),
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreValue}>{evaluation.empathy}/100</Text>
          </View>

          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>質問力</Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${evaluation.questioning}%`,
                    backgroundColor: getScoreColor(evaluation.questioning),
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreValue}>{evaluation.questioning}/100</Text>
          </View>

          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>距離感</Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${evaluation.distance}%`,
                    backgroundColor: getScoreColor(evaluation.distance),
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreValue}>{evaluation.distance}/100</Text>
          </View>

          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>魅力度</Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${evaluation.attractiveness}%`,
                    backgroundColor: getScoreColor(evaluation.attractiveness),
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreValue}>{evaluation.attractiveness}/100</Text>
          </View>
        </View>

        {/* フィードバック */}
        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>フィードバック</Text>
          <Text style={styles.feedbackText}>{evaluation.feedback}</Text>
        </View>

        {/* 強み */}
        {evaluation.strengths.length > 0 && (
          <View style={styles.strengthsSection}>
            <Text style={styles.sectionTitle}>✓ 強み</Text>
            {evaluation.strengths.map((strength, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>• {strength}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 改善点 */}
        {evaluation.improvements.length > 0 && (
          <View style={styles.improvementsSection}>
            <Text style={styles.sectionTitle}>💡 改善点</Text>
            {evaluation.improvements.map((improvement, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>• {improvement}</Text>
              </View>
            ))}
          </View>
        )}

        {/* アクションボタン */}
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            useChatStore.getState().clearChat();
            router.push('/');
          }}
        >
          <Text style={styles.retryButtonText}>別のシナリオに挑戦</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => {
            useChatStore.getState().clearChat();
            router.push('/');
          }}
        >
          <Text style={styles.homeButtonText}>ホームに戻る</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  rankCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  rankValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  scoresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  scoreItem: {
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  feedbackSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9999',
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  strengthsSection: {
    marginBottom: 24,
  },
  improvementsSection: {
    marginBottom: 24,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    color: '#333',
  },
  retryButton: {
    backgroundColor: '#FF9999',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  homeButton: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
});
