import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { THEME } from '../config/env';

interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Chip({
  label,
  variant = 'default',
  size = 'md',
  onPress,
  style,
}: ChipProps) {
  const chipStyle = [
    styles.base,
    styles[variant],
    styles[size],
    style,
  ];

  const getTextVariantStyle = () => {
    switch (variant) {
      case 'default': return styles.textDefault;
      case 'primary': return styles.textPrimary;
      case 'secondary': return styles.textSecondary;
      case 'outline': return styles.textOutline;
      default: return styles.textDefault;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'sm': return styles.textSm;
      case 'md': return styles.textMd;
      case 'lg': return styles.textLg;
      default: return styles.textMd;
    }
  };

  const textStyle = [
    styles.text,
    getTextVariantStyle(),
    getTextSizeStyle(),
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={chipStyle} onPress={onPress} activeOpacity={0.7}>
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={chipStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: THEME.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: THEME.colors.backgroundSecondary,
  },
  primary: {
    backgroundColor: THEME.colors.primary,
  },
  secondary: {
    backgroundColor: THEME.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sm: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
  },
  md: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
  },
  lg: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  textDefault: {
    color: THEME.colors.text,
  },
  textPrimary: {
    color: THEME.colors.textInverse,
  },
  textSecondary: {
    color: THEME.colors.textInverse,
  },
  textOutline: {
    color: THEME.colors.text,
  },
  textSm: {
    fontSize: 12,
  },
  textMd: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 16,
  },
}); 