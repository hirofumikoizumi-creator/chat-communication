export interface Scenario {
  id: string;
  name: string;
  description: string;
  mission: string;
  successCriteria: string[];
  systemPrompt: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'first_message',
    name: '初回メッセージ',
    description: 'マッチング後、最初のメッセージを送ります。第一印象が重要です。',
    mission: '相手が返信したくなる最初の一通を送る',
    successCriteria: [
      'プロフィールや状況に触れた自然な一言がある',
      '重すぎず、短すぎず、返しやすい質問で終える',
      '外見だけを褒めず、安心感と誠実さが伝わる',
    ],
    systemPrompt: 'あなたはチャットシミュレーションの相手役です。ユーザーから最初のメッセージを受け取ったら、自然で好感度の高い返信をしてください。相手の誠実さと創意工夫を評価してください。',
  },
  {
    id: 'continue_chat',
    name: '会話継続',
    description: 'マッチ後の会話を続けます。共感力と質問力が試されます。',
    mission: '相手の話を広げながら、心地よく会話を続ける',
    successCriteria: [
      '相手の発言に共感やリアクションを返している',
      '自分の話だけで終わらず、自然な質問を添えている',
      '距離を詰めすぎず、テンポよく会話を展開している',
    ],
    systemPrompt: 'あなたはチャットシミュレーションの相手役です。ユーザーとの会話を自然に続けてください。相手の質問への返答や、共感的なリアクションを心がけてください。',
  },
  {
    id: 'date_invite',
    name: 'デート誘導',
    description: 'デートに誘うタイミングと誘い方が重要です。',
    mission: '会話の流れから自然にデートへ誘う',
    successCriteria: [
      '相手の興味や会話内容に合う提案になっている',
      '日時や場所の候補があり、相手が判断しやすい',
      '断りやすさも残し、押しつけがましくない',
    ],
    systemPrompt: 'あなたはチャットシミュレーションの相手役です。ユーザーからのデート誘いに対して、自然で好感度の高い返信をしてください。相手の誘い方の工夫と誠実さを評価してください。',
  },
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return SCENARIOS.find((s) => s.id === id);
};
