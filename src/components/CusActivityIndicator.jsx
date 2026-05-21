import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';

const CusActivityIndicator = ({ Loading }) => {
  if (!Loading) return;
  return (
    <View style={styles.analyzingOverlay}>
      <View style={styles.analyzingBox}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.analyzingText}>Analyzing your face...</Text>
        <Text style={styles.analyzingSubText}>
          Finding perfect frames for you
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  analyzingBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 12,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E88E5',
    marginTop: 12,
  },
  analyzingSubText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
export default CusActivityIndicator;
