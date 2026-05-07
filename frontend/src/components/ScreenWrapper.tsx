import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, StatusBar, Platform } from 'react-native';
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
  const content = (
    <View style={[styles.inner, padded && styles.padded]}>
      {children}
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Colors.background} 
        translucent={true} 
      />
      <SafeAreaView style={styles.container}>
        {scrollable ? (
          <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} /> : undefined
            }
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1 },
  inner: { flex: 1 },
  padded: { padding: 20 },
});

export default ScreenWrapper;
