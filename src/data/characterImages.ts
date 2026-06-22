export const characterImages = {
  yui: require('../../assets/images/characters/yui.png'),
  sakura: require('../../assets/images/characters/sakura.png'),
  misaki: require('../../assets/images/characters/misaki.png'),
  nana: require('../../assets/images/characters/nana.png'),
  aoi: require('../../assets/images/characters/aoi-v2.png'),
  rina: require('../../assets/images/characters/rina-v2.png'),
  haruka: require('../../assets/images/characters/haruka-v2.png'),
  emi: require('../../assets/images/characters/emi-v2.png'),
} as const;

export type CharacterImageId = keyof typeof characterImages;
