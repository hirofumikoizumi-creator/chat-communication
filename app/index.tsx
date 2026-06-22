import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CHARACTERS } from '@/src/data/characters';
import { characterImages } from '@/src/data/characterImages';
import { useChatStore } from '@/src/store/chatStore';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = Math.min(120, width * 0.28);

export default function HomeScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const userProfile = useChatStore((state) => state.userProfile);
  const setUserProfile = useChatStore((state) => state.setUserProfile);

  const cards = useMemo(
    () =>
      CHARACTERS.map((character) => ({
        ...character,
        image: characterImages[character.id as keyof typeof characterImages],
      })),
    []
  );

  const currentCard = cards[currentIndex % cards.length];
  const nextCard = cards[(currentIndex + 1) % cards.length];

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const skipOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const resetCard = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 6,
    }).start();
  };

  const showNextCard = () => {
    setCurrentIndex((index) => index + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const skipCard = () => {
    Animated.timing(position, {
      toValue: { x: -width, y: 24 },
      duration: 180,
      useNativeDriver: false,
    }).start(showNextCard);
  };

  const chooseCard = () => {
    Animated.timing(position, {
      toValue: { x: width, y: 24 },
      duration: 180,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      router.push({
        pathname: '/character-detail',
        params: { characterId: currentCard.id },
      });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy * 0.18 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          chooseCard();
          return;
        }
        if (gesture.dx < -SWIPE_THRESHOLD) {
          skipCard();
          return;
        }
        resetCard();
      },
    })
  ).current;

  const rewindCard = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
    resetCard();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brandBlock}>
          <Text style={styles.brand}>Chat Match</Text>
          <Text style={styles.caption}>AI会話トレーナー</Text>
        </View>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/history')}
          accessibilityLabel="履歴"
        >
          <Text style={styles.historyIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.introPanel}>
        <Text style={styles.introTitle}>マッチ後の会話を、実戦前に練習。</Text>
        <Text style={styles.introCopy}>
          あなたのプロフィールを相手役AIが読み取り、年齢や職業に合った自然な返答と評価に反映します。
        </Text>
        <View style={styles.profileRow}>
          <TextInput
            style={[styles.profileInput, styles.nameInput]}
            placeholder="名前"
            placeholderTextColor="#A69B94"
            value={userProfile.name}
            onChangeText={(name) => setUserProfile({ name })}
          />
          <TextInput
            style={styles.ageInput}
            placeholder="年齢"
            placeholderTextColor="#A69B94"
            keyboardType="number-pad"
            value={userProfile.age}
            onChangeText={(age) => setUserProfile({ age })}
          />
        </View>
        <TextInput
          style={styles.profileInput}
          placeholder="職業 例: 営業、エンジニア、学生"
          placeholderTextColor="#A69B94"
          value={userProfile.job}
          onChangeText={(job) => setUserProfile({ job })}
        />
      </View>

      <View style={styles.deck}>
        <View style={[styles.card, styles.nextCard]}>
          <ImageBackground
            source={nextCard.image}
            style={styles.cardImage}
            imageStyle={styles.cardImageRadius}
          />
        </View>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            styles.activeCard,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            },
          ]}
        >
          <ImageBackground
            source={currentCard.image}
            style={styles.cardImage}
            imageStyle={styles.cardImageRadius}
          >
            <View style={styles.badges}>
              <Animated.View style={[styles.badge, styles.skipBadge, { opacity: skipOpacity }]}>
                <Text style={styles.skipBadgeText}>SKIP</Text>
              </Animated.View>
              <Animated.View style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}>
                <Text style={styles.likeBadgeText}>LIKE</Text>
              </Animated.View>
            </View>

            <View style={styles.profileOverlay}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{currentCard.name}</Text>
                <Text style={styles.age}>{currentCard.age}</Text>
              </View>
              <Text style={styles.role}>{currentCard.role}</Text>
              <Text style={styles.personality}>{currentCard.personality}</Text>
              <Text style={styles.description}>{currentCard.description}</Text>
            </View>
          </ImageBackground>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rewindButton]}
          onPress={rewindCard}
          accessibilityLabel="戻る"
        >
          <Text style={styles.rewindText}>↻</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.skipButton]}
          onPress={skipCard}
          accessibilityLabel="スキップ"
        >
          <Text style={styles.skipText}>×</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={chooseCard}
          accessibilityLabel="選択"
        >
          <Text style={styles.likeText}>♥</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    paddingHorizontal: 18,
  },
  topBar: {
    minHeight: 70,
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBlock: {
    alignItems: 'center',
  },
  brand: {
    color: '#222222',
    fontSize: 28,
    fontWeight: '800',
  },
  caption: {
    color: '#8D8178',
    fontSize: 13,
    marginTop: 2,
  },
  historyButton: {
    position: 'absolute',
    right: 0,
    top: 12,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6DED8',
  },
  historyIcon: {
    color: '#4B403A',
    fontSize: 28,
    lineHeight: 30,
  },
  introPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9E1DB',
    marginBottom: 12,
  },
  introTitle: {
    color: '#25201D',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  introCopy: {
    color: '#756B64',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  profileInput: {
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: '#F7F3F0',
    borderWidth: 1,
    borderColor: '#E8DDD6',
    paddingHorizontal: 12,
    color: '#28211D',
    fontSize: 14,
  },
  nameInput: {
    flex: 1,
  },
  ageInput: {
    width: 88,
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: '#F7F3F0',
    borderWidth: 1,
    borderColor: '#E8DDD6',
    paddingHorizontal: 12,
    color: '#28211D',
    fontSize: 14,
  },
  deck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 430,
  },
  card: {
    position: 'absolute',
    width: '100%',
    maxWidth: 430,
    height: '92%',
    maxHeight: 620,
    minHeight: 430,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E1DB',
  },
  activeCard: {
    zIndex: 2,
  },
  nextCard: {
    zIndex: 1,
    transform: [{ scale: 0.96 }, { translateY: 14 }],
    opacity: 0.62,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImageRadius: {
    borderRadius: 8,
  },
  badges: {
    position: 'absolute',
    top: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    borderWidth: 3,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  skipBadge: {
    borderColor: '#E25C5C',
    transform: [{ rotate: '-12deg' }],
  },
  likeBadge: {
    borderColor: '#23A772',
    transform: [{ rotate: '12deg' }],
  },
  skipBadgeText: {
    color: '#D74646',
    fontSize: 20,
    fontWeight: '900',
  },
  likeBadgeText: {
    color: '#168F5F',
    fontSize: 20,
    fontWeight: '900',
  },
  profileOverlay: {
    paddingHorizontal: 22,
    paddingTop: 84,
    paddingBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.43)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    marginRight: 10,
  },
  age: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 2,
  },
  role: {
    color: '#F8E9D9',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  personality: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  description: {
    color: '#EFE8E2',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  actions: {
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD6',
  },
  rewindButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  skipButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  likeButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FF5C8A',
    borderColor: '#FF5C8A',
  },
  rewindText: {
    color: '#B68B31',
    fontSize: 27,
    lineHeight: 30,
  },
  skipText: {
    color: '#E35C63',
    fontSize: 40,
    lineHeight: 42,
    fontWeight: '300',
  },
  likeText: {
    color: '#FFFFFF',
    fontSize: 35,
    lineHeight: 38,
  },
}) as Record<string, any>;
