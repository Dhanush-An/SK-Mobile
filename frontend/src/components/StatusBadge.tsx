import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    const s = status.toLowerCase();
    if (['pending', 'assigned'].includes(s)) return styles.pending;
    if (['accepted', 'in_progress'].includes(s)) return styles.active;
    if (['completed', 'success', 'paid', 'available'].includes(s)) return styles.success;
    if (['cancelled', 'rejected', 'failed', 'inactive', 'offline'].includes(s)) return styles.error;
    if (['busy'].includes(s)) return styles.warning;
    return styles.pending;
  };

  const label = status.replace('_', ' ').toUpperCase();

  return (
    <View style={[styles.badge, getStyle()]}>
      <Text style={[styles.text, { color: (getStyle() as any).color || '#fff' }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  pending: { backgroundColor: 'rgba(255,193,7,0.1)', borderColor: '#FFC107', color: '#FFC107' },
  active: { backgroundColor: 'rgba(41,121,255,0.1)', borderColor: '#2979FF', color: '#2979FF' },
  success: { backgroundColor: 'rgba(76,175,80,0.1)', borderColor: '#4CAF50', color: '#4CAF50' },
  error: { backgroundColor: 'rgba(255,82,82,0.1)', borderColor: '#FF5252', color: '#FF5252' },
  warning: { backgroundColor: 'rgba(255,145,0,0.1)', borderColor: '#FF9100', color: '#FF9100' },
});

export default StatusBadge;
