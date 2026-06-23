const runtimeEnv = ((globalThis as any).process?.env || {}) as Record<string, string | undefined>;

export const ON_DEVICE_LLM = {
  provider: 'llama.rn',
  modelName: 'Qwen3 0.6B Instruct GGUF',
  modelPath: runtimeEnv.EXPO_PUBLIC_ON_DEVICE_LLM_MODEL_PATH || '',
  recommendedModelFile: 'qwen3-0.6b-instruct-q4_k_m.gguf',
  contextSize: 2048,
  maxResponseTokens: 180,
  temperature: 0.72,
};
