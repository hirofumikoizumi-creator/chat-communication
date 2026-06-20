import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCharacterById } from '@/src/data/characters';
import { SCENARIOS } from '@/src/data/scenarios';
import { sessionAPI } from '@/src/services/api';
import { useChatStore } from '@/src/store/chatStore';

export default function CharacterDetailScreen() {
  const router = useRouter();
  const { characterId } = useLocalSearchParams<{ characterId: string }>();
  const character = characterId ? getCharacterById(characterId) : null;
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const initializeSession = useChatStore((state) => state.initializeSession);

  if (!character) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>キャラクターが見つかりません</Text>
      </SafeAreaView>
    );
  }

  const handleStartChat = async (scenarioId: string) => {
    try {
      setIsLoading(true);
      const sessionId = await sessionAPI.createSession(characterId, scenarioId);
      initializeSession(sessionId, characterId, scenarioId);
      router.push('/chat');
    } catch (error) {
      Alert.alert('エラー', 'セッションの作成に失敗しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* キャラクター情報 */}
        <View style={[styles.characterHeader, { backgroundColor: character.color }]}>
          <Text style={styles.characterEmoji}>{character.emoji}</Text>
          <Text style={styles.characterName}>{character.name}</Text>
          <Text style={styles.characterAge}>{character.age}歳 • {character.role}</Text>
          <Text style={styles.characterPersonality}>{character.personality}</Text>
        </View>

        {/* シナリオ選択 */}
        <View style={styles.scenariosSection}>
          <Text style={styles.sectionTitle}>シナリオを選択</Text>
          {SCENARIOS.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              style={[
                styles.scenarioCard,
                selectedScenario === scenario.id && styles.scenarioCardSelected,
              ]}
              onPress={() => setSelectedScenario(scenario.id)}
            >
              <View style={styles.scenarioContent}>
                <Text style={styles.scenarioName}>{scenario.name}</Text>
                <Text style={styles.scenarioDescription}>{scenario.description}</Text>
              </View>
              {selectedScenario === scenario.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* スタートボタン */}
        <TouchableOpacity
          style={[
            styles.startButton,
            !selectedScenario && styles.startButtonDisabled,
          ]}
          onPress={() => selectedScenario && handleStartChat(selectedScenario)}
          disabled={!selectedScenario || isLoading}
        >
          <Text style={styles.startButtonText}>
            {isLoading ? 'ロード中...' : 'チャットを開始'}
          </Text>
        </TouchableOpacity>

        {/* 戻るボタン */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← 戻る</Text>
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
  characterHeader: {
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
  characterEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  characterAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  characterPersonality: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
  },
  scenariosSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  scenarioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  scenarioCardSelected: {
    borderColor: '#FF9999',
    backgroundColor: '#FFF0F0',
  },
  scenarioContent: {
    flex: 1,
  },
  scenarioName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  scenarioDescription: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    fontSize: 24,
    color: '#FF9999',
    marginLeft: 12,
  },
  startButton: {
    backgroundColor: '#FF9999',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
});
