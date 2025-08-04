import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../config/env';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'sm' | 'md' | 'lg' | 'xl';
  elevation?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export default function Card({ 
  children, 
  variant = 'elevated', 
  padding = 'md',
  margin = 'sm',
  elevation = 'sm',
  style 
}: CardProps) {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'sm': return styles.paddingSm;
      case 'md': return styles.paddingMd;
      case 'lg': return styles.paddingLg;
      case 'xl': return styles.paddingXl;
      default: return styles.paddingMd;
    }
  };

  const getMarginStyle = () => {
    switch (margin) {
      case 'sm': return styles.marginSm;
      case 'md': return styles.marginMd;
      case 'lg': return styles.marginLg;
      case 'xl': return styles.marginXl;
      default: return styles.marginSm;
    }
  };

  const getElevationStyle = () => {
    switch (elevation) {
      case 'sm': return styles.elevationSm;
      case 'md': return styles.elevationMd;
      case 'lg': return styles.elevationLg;
      default: return styles.elevationSm;
    }
  };

  const cardStyle = [
    styles.base,
    styles[variant],
    getPaddingStyle(),
    getMarginStyle(),
    getElevationStyle(),
    style,
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surface,
  },
  elevated: {
    ...THEME.shadows.sm,
  },
  outlined: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  filled: {
    backgroundColor: THEME.colors.backgroundSecondary,
  },
  elevationSm: {
    ...THEME.shadows.sm,
  },
  elevationMd: {
    ...THEME.shadows.md,
  },
  elevationLg: {
    ...THEME.shadows.lg,
  },
  paddingSm: {
    padding: THEME.spacing.sm,
  },
  paddingMd: {
    padding: THEME.spacing.md,
  },
  paddingLg: {
    padding: THEME.spacing.lg,
  },
  paddingXl: {
    padding: THEME.spacing.xl,
  },
  marginSm: {
    margin: THEME.spacing.sm,
  },
  marginMd: {
    margin: THEME.spacing.md,
  },
  marginLg: {
    margin: THEME.spacing.lg,
  },
  marginXl: {
    margin: THEME.spacing.xl,
  },
}); 