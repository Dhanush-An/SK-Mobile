import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

const WorkHistory = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Work History Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  text: { color: Colors.text, fontSize: 18 }
});

export default WorkHistory;
