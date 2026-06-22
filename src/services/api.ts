import { evaluateOnDevice, generateOnDeviceReply } from '@/src/services/onDeviceLlm';

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

type LocalSession = {
  id: string;
  characterId: string;
  scenarioId: string;
  createdAt: string;
  evaluation?: EvaluationResult;
};

const sessions = new Map<string, LocalSession>();

export const chatAPI = {
  async sendMessage(
    sessionId: string,
    characterId: string,
    scenarioId: string,
    userMessage: string,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    return generateOnDeviceReply(characterId, scenarioId, userMessage, conversationHistory);
  },

  async evaluateSession(
    sessionId: string,
    characterId: string,
    scenarioId: string,
    conversationHistory: ChatMessage[]
  ): Promise<EvaluationResult> {
    const evaluation = await evaluateOnDevice(characterId, scenarioId, conversationHistory);
    const session = sessions.get(sessionId);
    if (session) {
      session.evaluation = evaluation;
    }
    return evaluation;
  },
};

export const sessionAPI = {
  async createSession(characterId: string, scenarioId: string): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessions.set(id, {
      id,
      characterId,
      scenarioId,
      createdAt: new Date().toISOString(),
    });
    return id;
  },

  async getSessions(): Promise<LocalSession[]> {
    return Array.from(sessions.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getSessionById(sessionId: string): Promise<LocalSession | null> {
    return sessions.get(sessionId) || null;
  },
};

