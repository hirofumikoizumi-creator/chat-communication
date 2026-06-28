import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  sessionId: string | null;
  characterId: string | null;
  scenarioId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeSession: (sessionId: string, characterId: string, scenarioId: string) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => Message;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessionId: null,
  characterId: null,
  scenarioId: null,
  messages: [],
  isLoading: false,
  error: null,

  initializeSession: (sessionId, characterId, scenarioId) =>
    set({
      sessionId,
      characterId,
      scenarioId,
      messages: [],
      error: null,
    }),

  addMessage: (role, content) => {
    const message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [
        ...state.messages,
        message,
      ],
    }));

    return message;
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearChat: () =>
    set({
      sessionId: null,
      characterId: null,
      scenarioId: null,
      messages: [],
      error: null,
    }),
}));
