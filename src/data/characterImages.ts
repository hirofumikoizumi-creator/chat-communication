export const characterImages = {
  yui: require('../../assets/images/characters/yui.png'),
  sakura: require('../../assets/images/characters/sakura.png'),
  misaki: require('../../assets/images/characters/misaki.png'),
  nana: require('../../assets/images/characters/nana.png'),
} as const;

export type CharacterImageId = keyof typeof characterImages;

