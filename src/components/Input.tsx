import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../config/env';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: string;
  rightIcon?: string;
  error?: string;
  variant?: 'filled' | 'outlined';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  leftIcon,
  rightIcon,
  error,
  variant = 'filled',
  style,
  textStyle,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputStyle = [
    styles.base,
    styles[variant],
    isFocused && styles.focused,
    error && styles.error,
    style,
  ];

  const textInputStyle = [
    styles.textInput,
    textStyle,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={inputStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={error ? THEME.colors.error : THEME.colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={textInputStyle}
          placeholder={placeholder}
          placeholderTextColor={THEME.colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={THEME.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <Ionicons
            name={rightIcon as any}
            size={20}
            color={THEME.colors.textSecondary}
            style={styles.rightIcon}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    ...THEME.typography.captionMedium,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.md,
    height: THEME.layout.inputHeight,
    paddingHorizontal: THEME.spacing.md,
  },
  filled: {
    backgroundColor: THEME.colors.backgroundSecondary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  focused: {
    borderColor: THEME.colors.primary,
    borderWidth: 1,
  },
  error: {
    borderColor: THEME.colors.error,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    ...THEME.typography.body,
    color: THEME.colors.text,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: THEME.spacing.sm,
  },
  rightIcon: {
    marginLeft: THEME.spacing.sm,
  },
  errorText: {
    ...THEME.typography.small,
    color: THEME.colors.error,
    marginTop: THEME.spacing.xs,
  },
}); 