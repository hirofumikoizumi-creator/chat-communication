# On-device LLM setup

This app is wired for fully on-device chat and evaluation through `llama.rn`, a React Native binding for `llama.cpp`.

## Runtime

- Native runtime: `llama.rn`
- Default target model family: Qwen GGUF
- Recommended first test model: `Qwen3 0.6B Instruct` or another small Japanese-capable Qwen GGUF quantized around Q4

Large GGUF files should not be committed to GitHub. Keep the model in local app storage, or bundle it only in native release artifacts.

## Model path

Set this environment variable for native builds:

```sh
EXPO_PUBLIC_ON_DEVICE_LLM_MODEL_PATH=file:///path/to/qwen3-0.6b-instruct-q4_k_m.gguf
```

The app uses deterministic local fallback replies and evaluation when the model path is empty or when the native runtime is unavailable. This keeps browser test play working without sending chat data to an external API.

## iPhone notes

This does not run inside Expo Go. Build a development client or native iOS app so `llama.rn` can load the native `llama.cpp` runtime.

For better iOS performance, use a small quantized model first:

- Qwen3 0.6B Instruct GGUF Q4: fastest first test
- Qwen2.5 1.5B Instruct GGUF Q4: better Japanese quality, heavier
- Gemma 3 1B/2B GGUF Q4: good compact alternative
- Llama 3.2 1B/3B GGUF Q4: strong general mobile baseline

For this app's short romantic conversation practice, start with Qwen3 0.6B. If replies feel too shallow, move to Qwen2.5 1.5B or Llama 3.2 3B on newer iPhones.

