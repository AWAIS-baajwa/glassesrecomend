import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ImageScanner = ({ imageUri }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scanAnimation = Animated.sequence([
      Animated.timing(translateY, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(scanAnimation).start();

    return () => translateY.setValue(0);
  }, [translateY]);

  const scanLinePosition = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.05, SCREEN_HEIGHT * 0.85],
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} />

      <View style={styles.overlayMask} />

      <Animated.View
        style={[
          styles.scanLine,
          {
            transform: [{ translateY: scanLinePosition }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  overlayMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  scanLine: {
    top: 0,
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: 4,
    backgroundColor: '#4CAF50',
    alignSelf: 'center',
    borderRadius: 2,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
});

export default ImageScanner;
