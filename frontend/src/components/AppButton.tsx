import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  fullWidth = true,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary': return styles.primary;
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      case 'danger': return styles.danger;
      case 'ghost': return styles.ghost;
      default: return styles.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') return Colors.accent;
    if (variant === 'danger') return '#fff';
    return '#fff';
  };

  return (
    <TouchableOpacity
      style={[styles.base, getStyles(), fullWidth && styles.fullWidth, style, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, variant === 'outline' && styles.textOutline]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  primary: { backgroundColor: Colors.accent },
  secondary: { backgroundColor: Colors.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.accent },
  danger: { backgroundColor: Colors.error },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.6 },
  text: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  textOutline: { color: Colors.accent },
});

export default AppButton;
