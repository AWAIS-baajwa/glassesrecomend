import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const UiAnimation = ({ onPress }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Text style={styles.heading}>Let AI determine your face shape</Text>
      <Image
        source={require('../assets/opticalshop.gif')}
        style={{
          width: '100%',
          height: '70%',
        }}
        resizeMode="contain"
      />
      <Text style={styles.text}>Tap the button below to scan your face</Text>
      <TouchableOpacity style={[styles.camera_button]} onPress={onPress}>
        <Text style={styles.button_text}>Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  camera_button: {
    backgroundColor: '#1E88E5',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    borderRadius: 50,
    zIndex: 10,
  },
  button_text: {
    color: 'white',
  },
  text: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    // paddingHorizontal: 32,
  },
  heading: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default UiAnimation;
