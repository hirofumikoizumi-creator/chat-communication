export const characterImages = {
  yui: require('../../assets/images/characters/yui.png'),
  sakura: require('../../assets/images/characters/sakura.png'),
  misaki: require('../../assets/images/characters/misaki.png'),
  nana: require('../../assets/images/characters/nana.png'),
  aoi: require('../../assets/images/characters/aoi.png'),
  rina: require('../../assets/images/characters/rina.png'),
  haruka: require('../../assets/images/characters/haruka.png'),
  emi: require('../../assets/images/characters/emi.png'),
} as const;

export type CharacterImageId = keyof typeof characterImages;
