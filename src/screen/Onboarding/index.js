import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import trr from "../../assets/onboard.png"

const { width, height } = Dimensions.get('window');

//  3-4 slides data
const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Scan Your Face',
    description:
      'Take a quick selfie using our smart camera technology to analyze your structural features.',
    image: require('../../assets/1.jpeg'),
    // image: require('../../assets/facescan.jpeg'),
  },
  {
    id: '2',
    title: 'AI Shape Detection',
    description:
      'Our integrated AI accurately identifies your exact face shape instantly.',
    image: require('../../assets/2.jpeg'),
    // image: require('../../assets/aifacedetection.jpeg'),
  },
  {
    id: '3',
    title: 'Virtual Try-On',
    description:
      'Browse hundreds of recommended frames tailored for you and try them on virtually!',
    image: require('../../assets/3.jpeg'),
    // image: require('../../assets/facescan.jpeg'),
  },
];

const Onboarding = ({ onFinish }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef(null);

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const handleNext = () => {
    const nextIndex = currentSlideIndex + 1;
    if (nextIndex < ONBOARDING_DATA.length) {
      flatListRef.current.scrollToIndex({ index: nextIndex });
      setCurrentSlideIndex(nextIndex);
    } else {
      onFinish();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="stretch"
            />
            {/* <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text> */}
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.btnText}>
            {currentSlideIndex === ONBOARDING_DATA.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03081d' },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: height * 0.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  indicator: {
    height: 8,
    width: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    mx: 4,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#1E88E5',
    width: 20,
  },
  primaryBtn: {
    backgroundColor: '#1E88E5',
    width: '90%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default Onboarding;
