import axios from 'axios';
import { getCharacterById } from '@/src/data/characters';
import { getScenarioById } from '@/src/data/scenarios';
import { localSessionStore } from './localSessionStore';

const runtime = globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};

const API_BASE_URL = runtime.process?.env?.EXPO_PUBLIC_API_BASE_URL ?? '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface EvaluationResult {
  empathy: number;
  questioning: number;
  distance: number;
  attractiveness: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface ApiError {
  message: string;
  code?: string;
}

const canUseRemoteApi = (): boolean => API_BASE_URL.trim().length > 0;

const handleError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message || 'API エラーが発生しました',
      code: error.code,
    };
  }
  return {
    message: error instanceof Error ? error.message : '不明なエラーが発生しました',
  };
};

const getLastUserMessage = (conversationHistory: ChatMessage[], fallback: string): string => {
  const lastUserMessage = [...conversationHistory].reverse().find((message) => message.role === 'user');
  return lastUserMessage?.content || fallback;
};

const createLocalReply = (
  characterId: string,
  scenarioId: string,
  userMessage: string,
  conversationHistory: ChatMessage[]
): string => {
  const character = getCharacterById(characterId);
  const scenario = getScenarioById(scenarioId);
  const latestMessage = getLastUserMessage(conversationHistory, userMessage);
  const name = character?.name ?? '相手';

  if (scenarioId === 'date_invite') {
    return `誘ってくれてありがとう。${latestMessage.includes('？') || latestMessage.includes('?') ? 'ちゃんと考えてくれている感じがして嬉しいです。' : 'もう少し具体的に、どこで何をするか聞けると安心できそう。'}私は${name}として、無理なく話せる誘い方だと前向きに考えやすいです。`;
  }

  if (scenarioId === 'continue_chat') {
    return `うん、そう言ってもらえると話しやすいです。${latestMessage.length > 24 ? 'ちゃんと会話を広げようとしてくれているのが伝わります。' : 'もう少しあなたのことも聞かせてもらえると嬉しいです。'}`;
  }

  return `メッセージありがとう。${character?.personality ?? '自然体'}な雰囲気で返すと、私は安心して返信しやすいです。${scenario?.name ? `「${scenario.name}」では、最初の一言に相手への興味が入っていると好印象です。` : ''}`;
};

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const createLocalEvaluation = (
  characterId: string,
  scenarioId: string,
  conversationHistory: ChatMessage[]
): EvaluationResult => {
  const character = getCharacterById(characterId);
  const scenario = getScenarioById(scenarioId);
  const userMessages = conversationHistory.filter((message) => message.role === 'user');
  const joined = userMessages.map((message) => message.content).join('\n');
  const questionCount = (joined.match(/[？?]/g) ?? []).length;
  const empathyHits = ['わかる', '大変', '嬉しい', 'ありがとう', 'いいね', '素敵', '楽しい'].filter((word) =>
    joined.includes(word)
  ).length;
  const totalLength = joined.length;

  const empathy = clampScore(45 + empathyHits * 12 + Math.min(totalLength / 12, 20));
  const questioning = clampScore(40 + questionCount * 18);
  const distance = clampScore(70 - Math.max(0, totalLength - 260) / 8 + (scenarioId === 'date_invite' ? 4 : 0));
  const attractiveness = clampScore((empathy + questioning + distance) / 3 + (userMessages.length >= 2 ? 6 : 0));
  const average = (empathy + questioning + distance + attractiveness) / 4;
  const rank: EvaluationResult['rank'] =
    average >= 85 ? 'S' : average >= 72 ? 'A' : average >= 58 ? 'B' : average >= 42 ? 'C' : 'D';

  return {
    empathy,
    questioning,
    distance,
    attractiveness,
    rank,
    feedback: `${character?.name ?? '相手'}との「${scenario?.name ?? '会話'}」を想定した無料ローカル評価です。Qwen接続時も同じ scenarioId と会話履歴を渡す設計なので、この評価条件をそのまま本番APIに移せます。`,
    strengths: [
      empathyHits > 0 ? '相手の気持ちに触れる言葉が入っています' : '会話の目的がシンプルで伝わりやすいです',
      questionCount > 0 ? '質問で会話を続ける姿勢があります' : '押しつけすぎない距離感があります',
    ],
    improvements: [
      questionCount === 0 ? '相手が答えやすい質問を1つ入れると会話が続きやすくなります' : '質問が続くと尋問感が出るため、自分の感想も混ぜると自然です',
      empathyHits === 0 ? '共感やリアクションの言葉を少し足すと好印象です' : 'よい反応に加えて、次の話題への橋渡しを作るとさらに自然です',
    ],
  };
};

export const chatAPI = {
  async sendMessage(
    sessionId: string,
    characterId: string,
    scenarioId: string,
    userMessage: string,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    if (!canUseRemoteApi()) {
      return createLocalReply(characterId, scenarioId, userMessage, [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ]);
    }

    try {
      const response = await api.post('/chat.sendMessage', {
        sessionId,
        characterId,
        scenarioId,
        userMessage,
        conversationHistory,
      });
      return response.data.result.data;
    } catch (error) {
      const apiError = handleError(error);
      console.error('Chat API error:', apiError);
      return createLocalReply(characterId, scenarioId, userMessage, conversationHistory);
    }
  },

  async evaluateSession(
    sessionId: string,
    characterId: string,
    scenarioId: string,
    conversationHistory: ChatMessage[]
  ): Promise<EvaluationResult> {
    if (!canUseRemoteApi()) {
      return createLocalEvaluation(characterId, scenarioId, conversationHistory);
    }

    try {
      const response = await api.post('/chat.evaluateSession', {
        sessionId,
        characterId,
        scenarioId,
        conversationHistory,
      });
      return response.data.result.data;
    } catch (error) {
      const apiError = handleError(error);
      console.error('Evaluation API error:', apiError);
      return createLocalEvaluation(characterId, scenarioId, conversationHistory);
    }
  },
};

export const sessionAPI = {
  async createSession(characterId: string, scenarioId: string): Promise<string> {
    return localSessionStore.createSession(characterId, scenarioId);
  },

  async getSessions() {
    return localSessionStore.getSessions();
  },

  async getSessionById(sessionId: string) {
    return localSessionStore.getSessionById(sessionId);
  },
};
