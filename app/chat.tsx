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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useChatStore } from '@/src/store/chatStore';
import { chatAPI } from '@/src/services/api';
import { getCharacterById } from '@/src/data/characters';
import { getScenarioById } from '@/src/data/scenarios';
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
  } = useChatStore();

  const character = characterId ? getCharacterById(characterId) : null;
  const scenario = scenarioId ? getScenarioById(scenarioId) : null;

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
        conversationHistory
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
        {/* ヘッダー */}
        <View style={[styles.header, { backgroundColor: character.color }]}>
          <View>
            <Text style={styles.characterNameHeader}>{character.emoji} {character.name}</Text>
            <Text style={styles.scenarioNameHeader}>{scenario.name}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* メッセージ表示エリア */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {character.name}からのメッセージを待っています...
              </Text>
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
              <Text style={styles.messageText}>{message.content}</Text>
            </View>
          ))}

          {isSending && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FF9999" />
              <Text style={styles.loadingText}>入力中...</Text>
            </View>
          )}
        </ScrollView>

        {/* 入力エリア */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="メッセージを入力..."
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

        {/* 終了ボタン */}
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishChat}
        >
          <Text style={styles.finishButtonText}>会話を終了 → 評価を見る</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  characterNameHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scenarioNameHeader: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    fontSize: 24,
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  messageBubble: {
    marginVertical: 8,
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF9999',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#FF9999',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: '#99CCFF',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 14,
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
