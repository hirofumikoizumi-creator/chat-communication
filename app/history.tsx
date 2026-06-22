import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { sessionAPI } from '@/src/services/api';
import { getCharacterById } from '@/src/data/characters';
import { getScenarioById } from '@/src/data/scenarios';
// import { useBannerAd } from '@/src/hooks/useAds';

interface HistorySession {
  id: string;
  characterId: string;
  scenarioId: string;
  createdAt: string;
  evaluation?: {
    rank: string;
    empathy: number;
    questioning: number;
    distance: number;
    attractiveness: number;
  };
}

export default function HistoryScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const { showBannerAd } = useBannerAd();

  useEffect(() => {
    fetchSessions();
    // showBannerAd();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const data = await sessionAPI.getSessions();
      setSessions(data || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSessionItem = ({ item }: { item: HistorySession }) => {
    const character = getCharacterById(item.characterId);
    const scenario = getScenarioById(item.scenarioId);

    if (!character || !scenario) return null;

    return (
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() => router.push({
          pathname: '/results',
          params: {
            sessionId: item.id,
            characterId: item.characterId,
            scenarioId: item.scenarioId,
          },
        })}
      >
        <View style={styles.sessionHeader}>
          <Text style={styles.characterName}>
            {character.emoji} {character.name}
          </Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>
              {item.evaluation?.rank || '-'}
            </Text>
          </View>
        </View>
        <Text style={styles.scenarioName}>{scenario.name}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString('ja-JP')}
        </Text>

        {item.evaluation && (
          <View style={styles.scoresPreview}>
            <View style={styles.scorePreviewItem}>
              <Text style={styles.scoreLabel}>共感力</Text>
              <Text style={styles.scoreValue}>{item.evaluation.empathy}</Text>
            </View>
            <View style={styles.scorePreviewItem}>
              <Text style={styles.scoreLabel}>質問力</Text>
              <Text style={styles.scoreValue}>{item.evaluation.questioning}</Text>
            </View>
            <View style={styles.scorePreviewItem}>
              <Text style={styles.scoreLabel}>距離感</Text>
              <Text style={styles.scoreValue}>{item.evaluation.distance}</Text>
            </View>
            <View style={styles.scorePreviewItem}>
              <Text style={styles.scoreLabel}>魅力度</Text>
              <Text style={styles.scoreValue}>{item.evaluation.attractiveness}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9999" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📜 会話履歴</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>まだ会話履歴がありません</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.startButtonText}>チャットを開始</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#333',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#FF9999',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rankBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  scenarioName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  scoresPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  scorePreviewItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9999',
  },
});
