import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCharacterById } from '@/src/data/characters';
import { SCENARIOS } from '@/src/data/scenarios';
import { characterImages } from '@/src/data/characterImages';
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
        <ImageBackground
          source={characterImages[character.id as keyof typeof characterImages]}
          style={styles.characterHero}
          imageStyle={styles.characterHeroImage}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterAge}>{character.age}歳 • {character.role}</Text>
            <Text style={styles.characterPersonality}>{character.personality}</Text>
            <Text style={styles.characterDescription}>{character.description}</Text>
          </View>
        </ImageBackground>

        <View style={styles.scenariosSection}>
          <Text style={styles.sectionTitle}>ミッションを選択</Text>
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
                <View style={styles.missionBox}>
                  <Text style={styles.missionLabel}>MISSION</Text>
                  <Text style={styles.missionText}>{scenario.mission}</Text>
                  {scenario.successCriteria.map((criteria) => (
                    <Text key={criteria} style={styles.criteriaText}>• {criteria}</Text>
                  ))}
                </View>
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
  characterHero: {
    minHeight: 430,
    marginBottom: 24,
    overflow: 'hidden',
    borderRadius: 8,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterHeroImage: {
    borderRadius: 8,
  },
  characterName: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  characterAge: {
    fontSize: 16,
    color: '#F7E7DD',
    marginBottom: 8,
    fontWeight: '700',
  },
  characterPersonality: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  characterDescription: {
    fontSize: 13,
    color: '#EFE7E1',
    lineHeight: 19,
    marginTop: 8,
  },
  heroOverlay: {
    paddingHorizontal: 22,
    paddingTop: 96,
    paddingBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.43)',
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
    borderRadius: 8,
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
    lineHeight: 18,
  },
  missionBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F6F2',
  },
  missionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#E35C63',
    marginBottom: 4,
  },
  missionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 8,
  },
  criteriaText: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
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
