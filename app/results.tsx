import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChatStore } from '@/src/store/chatStore';
import { chatAPI, EvaluationResult } from '@/src/services/api';
import { getCharacterById } from '@/src/data/characters';
import { getScenarioById } from '@/src/data/scenarios';
import { characterImages } from '@/src/data/characterImages';
// import { useInterstitialAd } from '@/src/hooks/useAds';

const getRankColor = (rank: string): string => {
  switch (rank) {
    case 'S':
      return '#D94C5C';
    case 'A':
      return '#E15F6E';
    case 'B':
      return '#8F6F57';
    case 'C':
      return '#7C716B';
    case 'D':
      return '#9C928C';
    default:
      return '#D94C5C';
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#FFD700';
  if (score >= 60) return '#D94C5C';
  if (score >= 40) return '#8F6F57';
  return '#B8ADA6';
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
  const { messages, userProfile } = useChatStore();
  const character = characterId ? getCharacterById(characterId) : null;
  const scenario = scenarioId ? getScenarioById(scenarioId) : null;
  const profileSummary = [
    userProfile.name || 'あなた',
    userProfile.age ? `${userProfile.age}歳` : '',
    userProfile.job || '',
  ].filter(Boolean).join(' / ');
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
        conversationHistory,
        userProfile
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
          <ActivityIndicator size="large" color="#D94C5C" />
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
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {character && (
              <Image source={characterImages[character.id]} style={styles.avatar} />
            )}
            <View style={styles.headerCopy}>
              <Text style={styles.kicker}>Conversation Report</Text>
              <Text style={styles.title}>{character ? `${character.name}との会話評価` : '会話評価'}</Text>
              <Text style={styles.subtitle}>{scenario?.name ?? 'ミッション'} / {profileSummary}</Text>
            </View>
          </View>
          <View style={styles.missionPanel}>
            <Text style={styles.missionLabel}>Mission</Text>
            <Text style={styles.missionText}>{scenario?.mission ?? '今回の会話ミッション'}</Text>
          </View>
        </View>

        <View style={styles.rankCard}>
          <View style={[styles.rankBadge, { backgroundColor: getRankColor(evaluation.rank) }]}>
            <Text style={styles.rankValue}>{evaluation.rank}</Text>
          </View>
          <View style={styles.rankCopy}>
            <Text style={styles.rankLabel}>総合ランク</Text>
            <Text style={styles.rankDescription}>
              距離感、共感、質問、魅力度をもとにした今回の会話スコアです。
            </Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>4軸スコア</Text>

          <View style={styles.scoreItem}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>共感力</Text>
              <Text style={styles.scoreValue}>{evaluation.empathy}</Text>
            </View>
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
          </View>

          <View style={styles.scoreItem}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>質問力</Text>
              <Text style={styles.scoreValue}>{evaluation.questioning}</Text>
            </View>
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
          </View>

          <View style={styles.scoreItem}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>距離感</Text>
              <Text style={styles.scoreValue}>{evaluation.distance}</Text>
            </View>
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
          </View>

          <View style={styles.scoreItem}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>魅力度</Text>
              <Text style={styles.scoreValue}>{evaluation.attractiveness}</Text>
            </View>
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
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>フィードバック</Text>
          <Text style={styles.feedbackText}>{evaluation.feedback}</Text>
        </View>

        {evaluation.strengths.length > 0 && (
          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>強み</Text>
            {evaluation.strengths.map((strength, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>+</Text>
                <Text style={styles.listItemText}>{strength}</Text>
              </View>
            ))}
          </View>
        )}

        {evaluation.improvements.length > 0 && (
          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>次に直すポイント</Text>
            {evaluation.improvements.map((improvement, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>→</Text>
                <Text style={styles.listItemText}>{improvement}</Text>
              </View>
            ))}
          </View>
        )}

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
    backgroundColor: '#F6F2EE',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5B514B',
    fontWeight: '700',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAE1DB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDE5DF',
  },
  headerCopy: {
    flex: 1,
    marginLeft: 13,
  },
  kicker: {
    color: '#D94C5C',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#211C19',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  subtitle: {
    color: '#7C716B',
    fontSize: 12,
    marginTop: 5,
    lineHeight: 17,
  },
  missionPanel: {
    backgroundColor: '#F7F3F0',
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
  },
  missionLabel: {
    color: '#D94C5C',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 5,
  },
  missionText: {
    color: '#2C2521',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  rankCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#28211D',
  },
  rankBadge: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankCopy: {
    flex: 1,
    marginLeft: 16,
  },
  rankLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '900',
    marginBottom: 6,
  },
  rankValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  rankDescription: {
    color: '#D8CEC7',
    fontSize: 13,
    lineHeight: 19,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAE1DB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#211C19',
    marginBottom: 14,
  },
  scoreItem: {
    marginBottom: 15,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C2521',
  },
  scoreBar: {
    height: 10,
    backgroundColor: '#F1EAE5',
    borderRadius: 999,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  scoreValue: {
    fontSize: 16,
    color: '#D94C5C',
    fontWeight: '900',
  },
  feedbackText: {
    fontSize: 14,
    color: '#2C2521',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F7F3F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  listBullet: {
    width: 22,
    color: '#D94C5C',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  listItemText: {
    fontSize: 14,
    color: '#2C2521',
    lineHeight: 20,
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#D94C5C',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  homeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0D7D1',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#5B514B',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
});
