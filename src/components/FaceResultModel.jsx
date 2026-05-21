//  Face shape modal: face shape name + reason + "See Recommendations" button
//  Recommendations carousel: swipeable cards with glasses images + details

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
// import heart_1 from '../assets/glasses';

const { width, height } = Dimensions.get('window');

// Glasses data mapped to each frame style
// Replace image requires with your actual local assets
const GLASSES_CATALOG = {
  Square: {
    image: require('../assets/glasses/heart_1.jpeg'),
    description:
      'Bold angular frame that adds definition to softer face shapes.',
    bestFor: 'Round, Oval faces',
    style: 'Classic / Professional',
  },
  Rectangular: {
    image: require('../assets/glasses/heart_1.jpeg'),
    description:
      'Timeless horizontal frame that elongates and balances the face.',
    bestFor: 'Round, Heart faces',
    style: 'Versatile / Everyday',
  },
  Wayfarer: {
    image: require('../assets/glasses/heart_1.jpeg'),
    description:
      'Iconic plastic frame with a wide top bar — suits almost everyone.',
    bestFor: 'Oval, Heart faces',
    style: 'Casual / Retro',
  },
  Aviator: {
    image: require('../assets/glasses/heart_1.jpeg'),
    description:
      'Teardrop metal frame, lightweight and universally flattering.',
    bestFor: 'Oval, Square faces',
    style: 'Classic / Sporty',
  },
  Round: {
    image: require('../assets/glasses/heart_1.jpeg'),
    description: 'Circular lenses that soften angular features beautifully.',
    bestFor: 'Square, Diamond faces',
    style: 'Artistic / Vintage',
  },
  'Cat-Eye': {
    image: require('../assets/glasses/heart_1.jpeg'),
    description: 'Upswept outer corners add lift and elegance to any face.',
    bestFor: 'Round, Square faces',
    style: 'Glamorous / Fashion',
  },
  Browline: {
    image: require('../assets/glasses/heart_1.jpeg'),
    description: 'Bold upper frame with a subtle lower rim for a smart look.',
    bestFor: 'Oval, Round faces',
    style: 'Smart / Semi-formal',
  },
  Geometric: {
    image: require('../assets/glasses/heart_1.jpeg'),
    description:
      'Hexagonal or angular frame that makes a strong style statement.',
    bestFor: 'Round, Oval faces',
    style: 'Modern / Bold',
  },
  Rimless: {
    image: require('../assets/glasses/heart_1.jpeg'),
    description: 'Ultra-minimal frame — lets your face be the focus.',
    bestFor: 'Heart, Oval faces',
    style: 'Minimal / Lightweight',
  },
};

// Face shape icons (emoji fallback — replace with your own icons if needed)
const FACE_SHAPE_META = {
  OVAL: { emoji: '🥚', color: '#1E88E5', bg: '#E8F5EE' },
  ROUND: { emoji: '⭕', color: '#1E88E5', bg: '#E3F2FD' },
  SQUARE: { emoji: '⬜', color: '#1E88E5', bg: '#FFF3E0' },
  HEART: { emoji: '♥️', color: '#1E88E5', bg: '#FCE4EC' },
  DIAMOND: { emoji: '♦️', color: '#1E88E5', bg: '#F3E5F5' },
};

// recommendation card
const RecommendationCard = ({ frameStyle, index, total }) => {
  const catalog = GLASSES_CATALOG[frameStyle] ?? {
    image: null,
    description: `A great frame style for your face shape.`,
    bestFor: 'Various face shapes',
    style: 'Versatile',
  };

  return (
    <View style={styles.card}>
      {/* Frame image */}
      <View style={styles.cardImageContainer}>
        {catalog.image ? (
          <Image
            source={catalog.image}
            style={styles.cardImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.cardImagePlaceholderText}>{frameStyle}</Text>
          </View>
        )}
        {/* Card number badge */}
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>
            {index + 1} / {total}
          </Text>
        </View>
      </View>

      {/* Frame details */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{frameStyle}</Text>
        <Text style={styles.cardStyle}>{catalog.style}</Text>
        <Text style={styles.cardDescription}>{catalog.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.bestForBadge}>
            <Text style={styles.bestForText}>✓ Best for {catalog.bestFor}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Main modal component
const FaceResultModal = ({ isVisible, onClose, aiResult }) => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  if (!aiResult) return null;

  const meta = FACE_SHAPE_META[aiResult.faceShape] ?? {
    emoji: '📐',
    color: '#607D8B',
    bg: '#ECEFF1',
  };

  const frames = aiResult.recommendedFrames ?? [];

  const handleScroll = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (width * 0.82));
    setActiveIndex(index);
  };

  const handleClose = () => {
    setShowCarousel(false);
    setActiveIndex(0);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* ── Close button ── */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Face shape result */}

          {!showCarousel && (
            <View style={styles.shapeSection}>
              {/* Shape icon */}
              <View
                style={[styles.shapeIconCircle, { backgroundColor: meta.bg }]}
              >
                <Text style={styles.shapeEmoji}>{meta.emoji}</Text>
              </View>

              {/* Shape name */}
              <Text style={[styles.shapeTitle, { color: meta.color }]}>
                {aiResult.faceShape} Face
              </Text>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Reason from AI */}
              <Text style={styles.reasonLabel}>Why we detected this</Text>
              <Text style={styles.reasonText}>{aiResult.reason}</Text>

              {/* Recommended frames preview pills */}
              <Text style={styles.framesPreviewLabel}>
                {frames.length} frame styles recommended for you
              </Text>
              <View style={styles.framePills}>
                {frames.map((f, i) => (
                  <View
                    key={i}
                    style={[styles.framePill, { backgroundColor: meta.bg }]}
                  >
                    <Text style={[styles.framePillText, { color: meta.color }]}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA button */}
              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: meta.color }]}
                onPress={() => setShowCarousel(true)}
              >
                <Text style={styles.ctaButtonText}>See Recommendations →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Recommendations carousel */}

          {showCarousel && (
            <View style={styles.carouselSection}>
              {/* Header */}
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setShowCarousel(false)}
              >
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>

              <Text style={styles.carouselTitle}>Recommended Frames</Text>
              <Text style={styles.carouselSubtitle}>
                For your {aiResult.faceShape} face shape
              </Text>

              {/* Cards carousel */}
              <FlatList
                ref={flatListRef}
                data={frames}
                horizontal
                pagingEnabled={false}
                snapToInterval={width * 0.82 + 12}
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.carouselList}
                keyExtractor={(item, i) => `${item}-${i}`}
                renderItem={({ item, index }) => (
                  <RecommendationCard
                    frameStyle={item}
                    index={index}
                    total={frames.length}
                  />
                )}
              />

              {/* Dot indicators */}
              <View style={styles.dotsRow}>
                {frames.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      activeIndex === i && [
                        styles.dotActive,
                        { backgroundColor: meta.color },
                      ],
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },

  // Bottom sheet
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 40,
    minHeight: height * 0.65,
    maxHeight: height * 0.92,
  },

  // Close button
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnText: { fontSize: 14, color: '#555' },

  //  Shape section
  shapeSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  shapeIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  shapeEmoji: { fontSize: 44 },

  shapeTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },

  reasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  reasonText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  framesPreviewLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  framePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  framePill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  framePillText: {
    fontSize: 13,
    fontWeight: '600',
  },

  ctaButton: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Carousel
  carouselSection: {
    paddingTop: 16,
  },

  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  carouselTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  carouselSubtitle: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 4,
  },

  carouselList: {
    paddingHorizontal: 20,
    paddingRight: 20,
    gap: 12,
  },

  //Card
  card: {
    width: width * 0.82,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },

  cardImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f8f8f8',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  cardImagePlaceholderText: {
    fontSize: 18,
    color: '#bbb',
    fontWeight: '600',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  cardBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginBottom: 2,
  },
  cardStyle: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
  },
  bestForBadge: {
    backgroundColor: '#E8F5EE',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  bestForText: {
    fontSize: 12,
    color: '#1E88E5',
    fontWeight: '600',
  },

  // Dot indicators
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    width: 20,
  },
});

export default FaceResultModal;
