import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Modal } from 'react-native';
import { Colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const LoadingAnimation = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Rotation loop
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse & Opacity loop
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
        ])
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal visible={true} transparent={false} animationType="none">
      <View style={styles.container}>
        {/* Dotted Grid Background */}
        <View style={styles.gridContainer}>
          {Array.from({ length: 15 }).map((_, i) => (
            <View key={`row-${i}`} style={styles.gridRow}>
              {Array.from({ length: 10 }).map((_, j) => (
                <View key={`dot-${i}-${j}`} style={styles.gridDot} />
              ))}
            </View>
          ))}
        </View>

        {/* Central HUD */}
        <View style={styles.hudContainer}>
          {/* Outer Circular Rings with Crosshairs */}
          <Animated.View style={[styles.ring, styles.outerRing, { transform: [{ rotate: spin }] }]}>
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />
          </Animated.View>
          
          <View style={[styles.ring, styles.middleRing]}>
             <View style={[styles.crosshairH, { width: '100%', opacity: 0.1 }]} />
             <View style={[styles.crosshairV, { height: '100%', opacity: 0.1 }]} />
          </View>

          <Animated.View style={[styles.ring, styles.innerRing, { transform: [{ scale: pulseAnim }] }]} />

          {/* Text Top */}
          <Text style={styles.statusText}>SYSTEM_AUTH_ACTIVE</Text>

          {/* Camera Icon Container */}
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📷</Text>
          </View>

          {/* Text Bottom */}
          <Text style={styles.mainText}>INITIALIZING SECURE TERMINAL</Text>
          
          <View style={styles.progressRow}>
            {[1, 0.8, 0.6, 0.4, 0.2].map((op, i) => (
              <View key={i} style={[styles.progressDot, { opacity: op }]} />
            ))}
          </View>
        </View>

        {/* Precise Corner Markers */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#000510',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: { ...StyleSheet.absoluteFill, justifyContent: 'space-around', paddingVertical: 40 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-around' },
  gridDot: { width: 2, height: 2, borderRadius: 1, backgroundColor: '#2979FF', opacity: 0.15 },
  
  hudContainer: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: 'rgba(41,121,255,0.2)',
    borderRadius: 500,
  },
  outerRing: { width: 320, height: 320 },
  middleRing: { width: 240, height: 240 },
  innerRing: { width: 180, height: 180, borderWidth: 1, borderColor: 'rgba(41,121,255,0.4)' },
  
  crosshairH: { position: 'absolute', top: '50%', width: 20, height: 1, backgroundColor: '#2979FF', left: -10 },
  crosshairV: { position: 'absolute', left: '50%', height: 20, width: 1, backgroundColor: '#2979FF', top: -10 },

  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(41,121,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2979FF',
    shadowColor: '#2979FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  icon: { fontSize: 36, color: '#2979FF' },
  
  statusText: { 
    position: 'absolute', 
    top: -120, 
    color: '#2979FF', 
    fontSize: 9, 
    fontWeight: '800', 
    letterSpacing: 3,
    opacity: 0.8
  },
  mainText: { 
    position: 'absolute', 
    bottom: -110, 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: '800', 
    letterSpacing: 1,
    opacity: 0.9
  },
  progressRow: { position: 'absolute', bottom: -135, flexDirection: 'row', gap: 6 },
  progressDot: { width: 15, height: 2, backgroundColor: '#2979FF', borderRadius: 1 },
  
  corner: { position: 'absolute', width: 25, height: 25, borderColor: 'rgba(41,121,255,0.4)', borderTopWidth: 1, borderLeftWidth: 1 },
  topLeft: { top: 30, left: 30 },
  topRight: { top: 30, right: 30, transform: [{ rotate: '90deg' }] },
  bottomLeft: { bottom: 30, left: 30, transform: [{ rotate: '-90deg' }] },
  bottomRight: { bottom: 30, right: 30, transform: [{ rotate: '180deg' }] },
});

export default LoadingAnimation;
