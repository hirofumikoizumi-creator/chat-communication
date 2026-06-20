import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://matchaiai-iizcntga.manus.space/api/trpc';

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

export const chatAPI = {
  async sendMessage(
    sessionId: string,
    characterId: string,
    scenarioId: string,
    userMessage: string,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
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
      throw apiError;
    }
  },

  async evaluateSession(
    sessionId: string,
    characterId: string,
    scenarioId: string,
    conversationHistory: ChatMessage[]
  ): Promise<EvaluationResult> {
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
      throw apiError;
    }
  },
};

export const sessionAPI = {
  async createSession(characterId: string, scenarioId: string): Promise<string> {
    try {
      const response = await api.post('/session.create', {
        characterId,
        scenarioId,
      });
      return response.data.result.data.id;
    } catch (error) {
      const apiError = handleError(error);
      console.error('Session create error:', apiError);
      throw apiError;
    }
  },

  async getSessions(): Promise<any[]> {
    try {
      const response = await api.post('/session.list', {});
      return response.data.result.data || [];
    } catch (error) {
      const apiError = handleError(error);
      console.error('Session list error:', apiError);
      // ネットワークエラーの場合は空配列を返す
      return [];
    }
  },

  async getSessionById(sessionId: string): Promise<any> {
    try {
      const response = await api.post('/session.getById', { sessionId });
      return response.data.result.data;
    } catch (error) {
      const apiError = handleError(error);
      console.error('Session get error:', apiError);
      throw apiError;
    }
  },
};
