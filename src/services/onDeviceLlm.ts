import { Platform } from 'react-native';
import { getCharacterById } from '@/src/data/characters';
import { getScenarioById } from '@/src/data/scenarios';
import { ON_DEVICE_LLM } from '@/src/config/llm';
import { ChatMessage, EvaluationResult } from '@/src/services/api';

type LlamaContext = {
  completion: (
    params: Record<string, unknown>,
    callback?: (data: { token?: string }) => void
  ) => Promise<{ text?: string }>;
};

let llamaContext: LlamaContext | null = null;
let llamaInitError: string | null = null;

const stopWords = [
  '</s>',
  '<|end|>',
  '<|eot_id|>',
  '<|end_of_text|>',
  '<|im_end|>',
  '<|EOT|>',
  '<|end_of_turn|>',
  '<|endoftext|>',
];

const clampScore = (value: number) => Math.max(20, Math.min(96, Math.round(value)));

const getConversationText = (history: ChatMessage[], latestUserMessage?: string) => {
  const lines = history.map((message) =>
    `${message.role === 'user' ? 'ユーザー' : '相手'}: ${message.content}`
  );
  if (latestUserMessage) {
    lines.push(`ユーザー: ${latestUserMessage}`);
  }
  return lines.join('\n');
};

const getNativeLlama = async () => {
  if (Platform.OS === 'web') {
    throw new Error('Web preview uses deterministic local fallback.');
  }
  if (!ON_DEVICE_LLM.modelPath) {
    throw new Error(
      `GGUF model path is not configured. Set EXPO_PUBLIC_ON_DEVICE_LLM_MODEL_PATH to a bundled or downloaded ${ON_DEVICE_LLM.recommendedModelFile} path.`
    );
  }
  if (llamaContext) return llamaContext;
  if (llamaInitError) throw new Error(llamaInitError);

  try {
    const nativeRequire = eval('require') as (name: string) => { initLlama: Function };
    const { initLlama } = nativeRequire('llama.rn');
    llamaContext = await initLlama({
      model: ON_DEVICE_LLM.modelPath,
      n_ctx: ON_DEVICE_LLM.contextSize,
      n_gpu_layers: 99,
      use_mlock: true,
    });
    return llamaContext;
  } catch (error) {
    llamaInitError = error instanceof Error ? error.message : 'Failed to initialize llama.rn';
    throw error;
  }
};

const buildCharacterSystemPrompt = (characterId: string, scenarioId: string) => {
  const character = getCharacterById(characterId);
  const scenario = getScenarioById(scenarioId);
  return [
    `あなたは恋愛会話トレーニングアプリの相手役です。`,
    `キャラクター: ${character?.name ?? '相手'} / ${character?.age ?? ''}歳 / ${character?.role ?? ''}`,
    `性格: ${character?.personality ?? ''}`,
    `シナリオ: ${scenario?.name ?? ''}`,
    `ミッション: ${scenario?.mission ?? ''}`,
    `ユーザーが練習できるよう、自然な日本語で1から3文だけ返信してください。`,
    `好意的すぎず、相手のメッセージの質に合わせて少しだけ距離感を調整してください。`,
  ].join('\n');
};

export const generateFallbackReply = (
  characterId: string,
  scenarioId: string,
  userMessage: string,
  history: ChatMessage[]
) => {
  const character = getCharacterById(characterId);
  const scenario = getScenarioById(scenarioId);
  const name = character?.name ?? '相手';
  const trimmed = userMessage.trim();
  const hasQuestion = /[?？]/.test(trimmed);
  const isShort = trimmed.length < 12;
  const hasInvite = /ご飯|カフェ|会|飲み|デート|行き/.test(trimmed);

  if (scenarioId === 'date_invite' || hasInvite) {
    return `誘ってくれてありがとう。${trimmed.includes('いつ') ? '候補を出してくれると決めやすいかも。' : 'もう少し話してからなら考えやすいかな。'}どんな雰囲気のお店を考えてる？`;
  }
  if (isShort) {
    return `${name}です。声をかけてくれてありがとう。もう少しだけ、何に興味を持ってくれたのか聞いてみたいな。`;
  }
  if (hasQuestion) {
    return `うん、いい質問だね。${scenario?.name === '初回メッセージ' ? '最初から話しやすい感じがして安心したよ。' : 'ちゃんと会話を広げようとしてくれてるのが伝わるよ。'}あなたはどう思う？`;
  }
  return `そうなんだ、話してくれてありがとう。${history.length > 2 ? '少しずつ雰囲気がわかってきた気がする。' : '最初の印象はやわらかくていい感じ。'}もう少し聞かせて。`;
};

export const generateOnDeviceReply = async (
  characterId: string,
  scenarioId: string,
  userMessage: string,
  conversationHistory: ChatMessage[]
) => {
  try {
    const context = await getNativeLlama();
    const result = await context.completion({
      messages: [
        { role: 'system', content: buildCharacterSystemPrompt(characterId, scenarioId) },
        ...conversationHistory.map((message) => ({
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: message.content,
        })),
        { role: 'user', content: userMessage },
      ],
      n_predict: ON_DEVICE_LLM.maxResponseTokens,
      temperature: ON_DEVICE_LLM.temperature,
      stop: stopWords,
    });
    return (result.text || '').trim() || generateFallbackReply(characterId, scenarioId, userMessage, conversationHistory);
  } catch (error) {
    console.warn('On-device LLM fallback:', error);
    return generateFallbackReply(characterId, scenarioId, userMessage, conversationHistory);
  }
};

const scoreFromConversation = (conversationHistory: ChatMessage[]) => {
  const userMessages = conversationHistory.filter((message) => message.role === 'user');
  const joined = userMessages.map((message) => message.content).join('\n');
  const totalLength = joined.length;
  const questionCount = (joined.match(/[?？]/g) || []).length;
  const empathyHits = (joined.match(/ありがとう|わかる|いいね|大変|楽し|嬉し|安心|すごい|素敵/g) || []).length;
  const inviteHits = (joined.match(/カフェ|ご飯|会|行き|予定|いつ|どこ|どうかな/g) || []).length;
  const pushyHits = (joined.match(/絶対|今すぐ|なんで|返信|会おうよ|無理/g) || []).length;

  return {
    empathy: clampScore(48 + empathyHits * 12 + Math.min(totalLength / 18, 24) - pushyHits * 8),
    questioning: clampScore(42 + questionCount * 15 + Math.min(userMessages.length * 4, 18)),
    distance: clampScore(68 + inviteHits * 4 - pushyHits * 14 - Math.max(0, questionCount - 5) * 4),
    attractiveness: clampScore(46 + empathyHits * 8 + questionCount * 5 + Math.min(totalLength / 24, 18) - pushyHits * 8),
  };
};

const rankFromAverage = (average: number): EvaluationResult['rank'] => {
  if (average >= 86) return 'S';
  if (average >= 72) return 'A';
  if (average >= 58) return 'B';
  if (average >= 44) return 'C';
  return 'D';
};

const buildEvaluationPrompt = (
  characterId: string,
  scenarioId: string,
  conversationHistory: ChatMessage[]
) => {
  const character = getCharacterById(characterId);
  const scenario = getScenarioById(scenarioId);
  return [
    '恋愛会話トレーナーとして、次の会話を評価してください。',
    `相手: ${character?.name ?? ''} (${character?.role ?? ''})`,
    `シナリオ: ${scenario?.name ?? ''}`,
    `ミッション: ${scenario?.mission ?? ''}`,
    `成功条件: ${(scenario?.successCriteria ?? []).join(' / ')}`,
    'JSONのみで返してください。キーは empathy, questioning, distance, attractiveness, rank, feedback, strengths, improvements。',
    '各スコアは0から100、rankはS/A/B/C/D、strengthsとimprovementsは日本語文字列配列。',
    getConversationText(conversationHistory),
  ].join('\n');
};

export const evaluateWithFallback = (
  characterId: string,
  scenarioId: string,
  conversationHistory: ChatMessage[]
): EvaluationResult => {
  const scenario = getScenarioById(scenarioId);
  const scores = scoreFromConversation(conversationHistory);
  const average = (scores.empathy + scores.questioning + scores.distance + scores.attractiveness) / 4;
  const rank = rankFromAverage(average);
  const hasConversation = conversationHistory.some((message) => message.role === 'user');

  return {
    ...scores,
    rank,
    feedback: hasConversation
      ? `${scenario?.mission ?? '今回のミッション'}に対して、会話の量と質問の入れ方から評価しました。相手の発言に触れてから質問を返すと、さらに自然な流れになります。`
      : 'まだユーザー発話が少ないため、まずは相手が返しやすい一言と質問を送ってみましょう。',
    strengths: [
      scores.questioning >= 60 ? '質問を使って会話を続けようとしている' : '会話を始める準備ができている',
      scores.distance >= 60 ? '距離感が比較的自然' : '丁寧に進めようとしている',
    ],
    improvements: [
      scores.empathy < 70 ? '相手の言葉に共感する一文を先に入れる' : '共感に加えて自分の具体的な体験も少し足す',
      scores.attractiveness < 70 ? '短い感想だけで終わらず、相手が答えやすい質問で締める' : '誘う場面では日時や場所の候補を出す',
    ],
  };
};

export const evaluateOnDevice = async (
  characterId: string,
  scenarioId: string,
  conversationHistory: ChatMessage[]
): Promise<EvaluationResult> => {
  try {
    const context = await getNativeLlama();
    const result = await context.completion({
      messages: [
        { role: 'system', content: 'あなたは厳密なJSONだけを返す会話評価AIです。' },
        { role: 'user', content: buildEvaluationPrompt(characterId, scenarioId, conversationHistory) },
      ],
      n_predict: 360,
      temperature: 0.2,
      stop: stopWords,
    });
    const rawText = (result.text || '').trim();
    const jsonText = rawText.slice(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonText);
    return {
      empathy: clampScore(Number(parsed.empathy)),
      questioning: clampScore(Number(parsed.questioning)),
      distance: clampScore(Number(parsed.distance)),
      attractiveness: clampScore(Number(parsed.attractiveness)),
      rank: ['S', 'A', 'B', 'C', 'D'].includes(parsed.rank) ? parsed.rank : 'B',
      feedback: String(parsed.feedback || ''),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
    };
  } catch (error) {
    console.warn('On-device evaluation fallback:', error);
    return evaluateWithFallback(characterId, scenarioId, conversationHistory);
  }
};

