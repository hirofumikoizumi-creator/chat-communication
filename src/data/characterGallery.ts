import type { ImageSourcePropType } from 'react-native';

export type CharacterGalleryItem = {
  image: ImageSourcePropType;
  label: string;
};

export const characterGalleryImages: Record<string, CharacterGalleryItem[]> = {
  yui: [
    { image: require('../../assets/images/characters/gallery-v2/yui-1.png'), label: '放課後の勉強' },
    { image: require('../../assets/images/characters/gallery-v2/yui-2.png'), label: '桜道の帰り道' },
    { image: require('../../assets/images/characters/gallery-v2/yui-3.png'), label: '休日のスイーツ' },
    { image: require('../../assets/images/characters/gallery-v2/yui-4.png'), label: '文具ショップ巡り' },
  ],
  sakura: [
    { image: require('../../assets/images/characters/gallery-v2/sakura-1.png'), label: '朝の通勤' },
    { image: require('../../assets/images/characters/gallery-v2/sakura-2.png'), label: 'カフェ作業' },
    { image: require('../../assets/images/characters/gallery-v2/sakura-3.png'), label: '仕事終わりのご飯' },
    { image: require('../../assets/images/characters/gallery-v2/sakura-4.png'), label: '週末ショッピング' },
  ],
  misaki: [
    { image: require('../../assets/images/characters/gallery-v2/misaki-1.png'), label: 'ビジネス街の朝' },
    { image: require('../../assets/images/characters/gallery-v2/misaki-2.png'), label: '読書時間' },
    { image: require('../../assets/images/characters/gallery-v2/misaki-3.png'), label: '自炊の夜' },
    { image: require('../../assets/images/characters/gallery-v2/misaki-4.png'), label: '夜景テラス' },
  ],
  nana: [
    { image: require('../../assets/images/characters/gallery-v2/nana-1.png'), label: 'ワインバー' },
    { image: require('../../assets/images/characters/gallery-v2/nana-2.png'), label: '雨の日の読書' },
    { image: require('../../assets/images/characters/gallery-v2/nana-3.png'), label: '夜の散歩' },
    { image: require('../../assets/images/characters/gallery-v2/nana-4.png'), label: '花のある部屋' },
  ],
  aoi: [
    { image: require('../../assets/images/characters/gallery-v2/aoi-1.png'), label: '図書館で読書' },
    { image: require('../../assets/images/characters/gallery-v2/aoi-2.png'), label: '映画館めぐり' },
    { image: require('../../assets/images/characters/gallery-v2/aoi-3.png'), label: 'キャンパス散歩' },
    { image: require('../../assets/images/characters/gallery-v2/aoi-4.png'), label: 'ノートとラテ' },
  ],
  rina: [
    { image: require('../../assets/images/characters/gallery-v2/rina-1.png'), label: 'ラテアート' },
    { image: require('../../assets/images/characters/gallery-v2/rina-2.png'), label: '休日の写真' },
    { image: require('../../assets/images/characters/gallery-v2/rina-3.png'), label: '花市さんぽ' },
    { image: require('../../assets/images/characters/gallery-v2/rina-4.png'), label: 'テラスで一息' },
  ],
  haruka: [
    { image: require('../../assets/images/characters/gallery-v2/haruka-1.png'), label: 'デザイン作業' },
    { image: require('../../assets/images/characters/gallery-v2/haruka-2.png'), label: '美術館' },
    { image: require('../../assets/images/characters/gallery-v2/haruka-3.png'), label: '器とインテリア' },
    { image: require('../../assets/images/characters/gallery-v2/haruka-4.png'), label: 'ミニマルカフェ' },
  ],
  emi: [
    { image: require('../../assets/images/characters/gallery-v2/emi-1.png'), label: 'ヨガスタジオ' },
    { image: require('../../assets/images/characters/gallery-v2/emi-2.png'), label: 'ヘルシー習慣' },
    { image: require('../../assets/images/characters/gallery-v2/emi-3.png'), label: '朝の公園' },
    { image: require('../../assets/images/characters/gallery-v2/emi-4.png'), label: 'ハーブティー時間' },
  ],
};
