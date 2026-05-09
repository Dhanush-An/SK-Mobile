import React from 'react';
import { View, Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';

interface AppLogoProps {
  size?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  rounded?: boolean;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 40, width, height, style, rounded = true }) => {
  const w = width || size;
  const h = height || size;

  return (
    <View style={[
      styles.container, 
      { width: w, height: h },
      rounded && styles.rounded
    ]}>
      <Image
        source={require('../assets/sk_tech_logo.png')}
        style={[
          {
            width: w * 0.9,
            height: h * 0.9,
            resizeMode: 'contain',
          },
          style,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // White background for the logo square
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: 8,
  }
});

export default AppLogo;

