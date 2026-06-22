import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useChatStore } from '@/src/store/chatStore';
import { chatAPI } from '@/src/services/api';
import { getCharacterById } from '@/src/data/characters';
import { getScenarioById } from '@/src/data/scenarios';
import { characterImages } from '@/src/data/characterImages';
// import { useBannerAd } from '@/src/hooks/useAds';

export default function ChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  // const { showBannerAd } = useBannerAd();

  const {
    sessionId,
    characterId,
    scenarioId,
    messages,
    addMessage,
    setError,
    userProfile,
  } = useChatStore();

  const character = characterId ? getCharacterById(characterId) : null;
  const scenario = scenarioId ? getScenarioById(scenarioId) : null;
  const profileSummary = [
    userProfile.name || 'あなた',
    userProfile.age ? `${userProfile.age}歳` : '',
    userProfile.job || '',
  ].filter(Boolean).join(' / ');

  // useEffect(() => {
  //   showBannerAd();
  // }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !sessionId || !characterId || !scenarioId) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage('user', userMessage);
    setIsSending(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await chatAPI.sendMessage(
        sessionId,
        characterId,
        scenarioId,
        userMessage,
        conversationHistory,
        userProfile
      );

      addMessage('assistant', response);
    } catch (error) {
      setError('メッセージの送信に失敗しました');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFinishChat = () => {
    router.push({
      pathname: '/results',
      params: {
        sessionId,
        characterId,
        scenarioId,
      },
    });
  };

  if (!character || !scenario) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>セッション情報が見つかりません</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <Image source={characterImages[character.id]} style={styles.avatar} />
            <View style={styles.headerText}>
              <View style={styles.nameRow}>
                <Text style={styles.characterNameHeader}>{character.name}</Text>
                <View style={styles.statusDot} />
              </View>
              <Text style={styles.scenarioNameHeader}>{scenario.name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contextPanel}>
          <View style={styles.contextTopRow}>
            <Text style={styles.contextLabel}>Mission</Text>
            <Text style={styles.profilePill}>{profileSummary}</Text>
          </View>
          <Text style={styles.missionText}>{scenario.mission}</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Image source={characterImages[character.id]} style={styles.emptyAvatar} />
              <Text style={styles.emptyStateTitle}>{character.name}との会話</Text>
              <Text style={styles.emptyStateText}>{scenario.mission}</Text>
            </View>
          )}

          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === 'user'
                  ? styles.userMessage
                  : styles.assistantMessage,
              ]}
            >
              <Text style={[
                styles.messageText,
                message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
              ]}>{message.content}</Text>
            </View>
          ))}

          {isSending && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FF9999" />
              <Text style={styles.loadingText}>入力中...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="返信を入力"
            placeholderTextColor="#9C928C"
            value={inputText}
            onChangeText={setInputText}
            editable={!isSending}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (isSending || !inputText.trim()) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={isSending || !inputText.trim()}
          >
            <Text style={styles.sendButtonText}>送信</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishChat}
        >
          <Text style={styles.finishButtonText}>会話を終了して評価を見る</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F2EE',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE1DB',
    backgroundColor: '#FFFFFF',
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EDE5DF',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterNameHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#211C19',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginLeft: 8,
  },
  scenarioNameHeader: {
    fontSize: 13,
    color: '#7C716B',
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4EEE9',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#5B514B',
    lineHeight: 27,
  },
  contextPanel: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1DB',
  },
  contextTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contextLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D94C5C',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  profilePill: {
    maxWidth: '68%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#F6F2EE',
    color: '#5B514B',
    fontSize: 11,
    fontWeight: '700',
  },
  missionText: {
    color: '#2C2521',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 44,
    paddingHorizontal: 28,
  },
  emptyAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
    backgroundColor: '#EDE5DF',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#211C19',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#7C716B',
    textAlign: 'center',
    lineHeight: 21,
  },
  messageBubble: {
    marginVertical: 6,
    maxWidth: '82%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#28211D',
    borderBottomRightRadius: 6,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DED7',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#2C2521',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#7C716B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFE7E1',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#2E221C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F3F0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 15,
    color: '#211C19',
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#D94C5C',
    borderRadius: 18,
    minWidth: 58,
    minHeight: 42,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D8CEC7',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D94C5C',
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D94C5C',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
});
