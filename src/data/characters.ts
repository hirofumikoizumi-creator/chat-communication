export interface Character {
  id: string;
  name: string;
  age: number;
  emoji: string;
  role: string;
  personality: string;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
  description: string;
}

export const CHARACTERS: Character[] = [
  {
    id: 'yui',
    name: 'ゆい',
    age: 18,
    emoji: '👧',
    role: '高校生',
    personality: 'フレンドリー、素直、ちょっと照れ屋',
    difficulty: 'easy',
    color: '#FFB6D9',
    description: '高校3年生。恋愛初心者で、素直な反応が特徴。',
  },
  {
    id: 'sakura',
    name: 'さくら',
    age: 23,
    emoji: '👩',
    role: '社会人1年目',
    personality: '明るい、仕事の話好き、少し忙しい',
    difficulty: 'medium',
    color: '#FFD699',
    description: '新社会人。仕事の話や恋愛について考えている。',
  },
  {
    id: 'misaki',
    name: 'みさき',
    age: 27,
    emoji: '👩‍💼',
    role: 'OL',
    personality: '落ち着き、キャリア志向、大人っぽい',
    difficulty: 'hard',
    color: '#FFEB99',
    description: 'キャリアウーマン。大人の恋愛観を持っている。',
  },
  {
    id: 'nana',
    name: 'なな',
    age: 32,
    emoji: '👩‍🦰',
    role: '大人女子',
    personality: '人生経験豊富、洗練、少し神秘的',
    difficulty: 'hard',
    color: '#D4FFB6',
    description: '人生経験豊富な大人女性。深い会話を好む。',
  },
  {
    id: 'aoi',
    name: 'あおい',
    age: 21,
    emoji: '👩',
    role: '大学生',
    personality: '穏やか、クリエイティブ、聞き上手',
    difficulty: 'easy',
    color: '#CFE8FF',
    description: '文学と映画が好きな大学生。ゆっくり距離を縮める会話が得意。',
  },
  {
    id: 'rina',
    name: 'りな',
    age: 25,
    emoji: '👩',
    role: 'カフェスタッフ',
    personality: '明るい、社交的、写真好き',
    difficulty: 'medium',
    color: '#F6D7B8',
    description: '週末は写真を撮りに出かけるタイプ。軽快で自然な会話を好む。',
  },
  {
    id: 'haruka',
    name: 'はるか',
    age: 29,
    emoji: '👩‍💻',
    role: 'プロダクトデザイナー',
    personality: '知的、落ち着き、観察力が高い',
    difficulty: 'hard',
    color: '#D9D2FF',
    description: '仕事にも生活にもこだわりがある大人女性。浅すぎる会話には少し慎重。',
  },
  {
    id: 'emi',
    name: 'えみ',
    age: 35,
    emoji: '👩',
    role: 'ウェルネスコーチ',
    personality: '包容力、上品、自立している',
    difficulty: 'hard',
    color: '#D9EBCB',
    description: '心地よい距離感と誠実さを重視する。落ち着いた深い会話が好き。',
  },
];

export const getCharacterById = (id: string): Character | undefined => {
  return CHARACTERS.find((c) => c.id === id);
};
