import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import type { EvaluationResult } from './api';

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface StoredSession {
  id: string;
  characterId: string;
  scenarioId: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
  evaluation?: EvaluationResult;
}

const STORAGE_KEY = 'chat-sim-trainer.sessions.v1';
const STORAGE_DIR = `${FileSystem.documentDirectory ?? ''}chat-sim-trainer`;
const STORAGE_PATH = `${STORAGE_DIR}/sessions.json`;

interface KeyValueStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const getWebStorage = (): KeyValueStorage | null => {
  if (Platform.OS !== 'web') return null;
  const root = globalThis as typeof globalThis & { localStorage?: KeyValueStorage };
  return root.localStorage ?? null;
};

const readRawSessions = async (): Promise<string | null> => {
  const webStorage = getWebStorage();
  if (webStorage) return webStorage.getItem(STORAGE_KEY);

  if (!FileSystem.documentDirectory) return null;

  const info = await FileSystem.getInfoAsync(STORAGE_PATH);
  if (!info.exists) return null;
  return FileSystem.readAsStringAsync(STORAGE_PATH);
};

const writeRawSessions = async (value: string): Promise<void> => {
  const webStorage = getWebStorage();
  if (webStorage) {
    webStorage.setItem(STORAGE_KEY, value);
    return;
  }

  if (!FileSystem.documentDirectory) return;

  const dirInfo = await FileSystem.getInfoAsync(STORAGE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
  }
  await FileSystem.writeAsStringAsync(STORAGE_PATH, value);
};

const readSessions = async (): Promise<StoredSession[]> => {
  try {
    const raw = await readRawSessions();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to read local sessions:', error);
    return [];
  }
};

const writeSessions = async (sessions: StoredSession[]): Promise<void> => {
  await writeRawSessions(JSON.stringify(sessions));
};

export const createAnonymousSessionId = (): string => {
  return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const localSessionStore = {
  async createSession(characterId: string, scenarioId: string): Promise<string> {
    const now = new Date().toISOString();
    const sessionId = createAnonymousSessionId();
    const sessions = await readSessions();

    sessions.unshift({
      id: sessionId,
      characterId,
      scenarioId,
      createdAt: now,
      updatedAt: now,
      messages: [],
    });

    await writeSessions(sessions);
    return sessionId;
  },

  async getSessions(): Promise<StoredSession[]> {
    const sessions = await readSessions();
    return sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async getSessionById(sessionId: string): Promise<StoredSession | null> {
    const sessions = await readSessions();
    return sessions.find((session) => session.id === sessionId) ?? null;
  },

  async saveMessages(sessionId: string, messages: StoredMessage[]): Promise<void> {
    const sessions = await readSessions();
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;

    session.messages = messages;
    session.updatedAt = new Date().toISOString();
    await writeSessions(sessions);
  },

  async saveEvaluation(sessionId: string, evaluation: EvaluationResult): Promise<void> {
    const sessions = await readSessions();
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;

    session.evaluation = evaluation;
    session.updatedAt = new Date().toISOString();
    await writeSessions(sessions);
  },
};
