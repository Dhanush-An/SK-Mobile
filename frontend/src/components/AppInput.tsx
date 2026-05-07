import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, KeyboardTypeOptions, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

interface AppInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isPassword?: boolean;
  leftIcon?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  containerStyle?: ViewStyle;
  maxLength?: number;
  editable?: boolean;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isPassword = false,
  leftIcon,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  containerStyle,
  maxLength,
  editable = true,
}) => {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}
        <TextInput
          style={[styles.input, multiline && { height: numberOfLines * 24, textAlignVertical: 'top' }]}
          placeholder={placeholder}
          placeholderTextColor={Colors.mutedText}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{secure ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  label: { color: Colors.mutedText, fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  input: { flex: 1, color: Colors.text, fontSize: 15, paddingVertical: 14, minHeight: 52 },
  inputError: { borderColor: Colors.error },
  icon: { marginRight: 12, fontSize: 18 },
  eyeBtn: { padding: 4, marginLeft: 8 },
  eyeIcon: { fontSize: 18 },
  errorText: { color: Colors.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
});

export default AppInput;
