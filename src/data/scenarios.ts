export interface Scenario {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'first_message',
    name: '初回メッセージ',
    description: 'マッチング後、最初のメッセージを送ります。第一印象が重要です。',
    systemPrompt: 'あなたはチャットシミュレーションの相手役です。ユーザーから最初のメッセージを受け取ったら、自然で好感度の高い返信をしてください。相手の誠実さと創意工夫を評価してください。',
  },
  {
    id: 'continue_chat',
    name: '会話継続',
    description: 'マッチ後の会話を続けます。共感力と質問力が試されます。',
    systemPrompt: 'あなたはチャットシミュレーションの相手役です。ユーザーとの会話を自然に続けてください。相手の質問への返答や、共感的なリアクションを心がけてください。',
  },
  {
    id: 'date_invite',
    name: 'デート誘導',
    description: 'デートに誘うタイミングと誘い方が重要です。',
    systemPrompt: 'あなたはチャットシミュレーションの相手役です。ユーザーからのデート誘いに対して、自然で好感度の高い返信をしてください。相手の誘い方の工夫と誠実さを評価してください。',
  },
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return SCENARIOS.find((s) => s.id === id);
};
