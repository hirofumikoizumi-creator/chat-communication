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
];

export const getCharacterById = (id: string): Character | undefined => {
  return CHARACTERS.find((c) => c.id === id);
};
