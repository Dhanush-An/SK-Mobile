import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  scrollable = true, 
  padded = true,
  refreshing = false,
  onRefresh 
}) => {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[
      styles.inner, 
      padded && styles.padded,
    ]}>
      {children}
    </View>
  );

  return (
    <View style={[
      styles.outerContainer, 
      { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0) }
    ]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      {scrollable ? (
        <ScrollView 
          style={styles.container} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} /> : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.container}>
          {content}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: { flex: 1 },
  inner: { flex: 1 },
  padded: { padding: 20 },
});

export default ScreenWrapper;
