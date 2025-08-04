// 환경 변수 설정
export const ENV = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || '화산족보',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
};

// 개발 환경 확인
export const IS_DEVELOPMENT = __DEV__;

// API 설정
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// 앱 설정
export const APP_CONFIG = {
  NAME: '화산족보',
  VERSION: '2.0.0',
  BUILD_NUMBER: '6',
};

export const THEME = {
  colors: {
    // Minimal Color Palette
    primary: '#000000', // Pure Black
    primaryLight: '#333333',
    primaryDark: '#000000',
    
    // Secondary colors
    secondary: '#666666', // Gray
    secondaryLight: '#999999',
    
    // Background colors - Clean White
    background: '#FFFFFF',
    backgroundSecondary: '#F8F8F8',
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.95)',
    
    // Text colors - High contrast
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverse: '#FFFFFF',
    
    // Status colors - Minimal
    success: '#000000',
    warning: '#000000',
    error: '#FF0000',
    info: '#000000',
    
    // Border and shadow - Subtle
    border: '#E5E5E5',
    borderLight: '#F0F0F0',
    shadow: 'rgba(0, 0, 0, 0.05)',
    shadowDark: 'rgba(0, 0, 0, 0.1)',
    
    // Gradients - Minimal
    gradientStart: '#000000',
    gradientEnd: '#333333',
    gradientSecondary: '#666666',
    gradientTertiary: '#999999',
  },
  spacing: {
    xs: 4,
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10,
    xxl: 12,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    glass: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 36,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: -0.2,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 26,
      letterSpacing: -0.1,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    captionMedium: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    small: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.2,
    },
  },
  layout: {
    maxWidth: 400,
    containerPadding: 16,
    cardPadding: 16,
    buttonHeight: 44,
    inputHeight: 44,
    borderRadius: 6,
  },
};

export const THEME_LIGHT = {
  ...THEME,
  colors: {
    ...THEME.colors,
    background: '#FFFFFF',
    text: '#000000',
    surface: '#FFFFFF',
    primary: '#000000',
    secondary: '#666666',
    elevation: {
      level0: 'transparent',
      level1: '#F5F5F5',
      level2: '#EEEEEE',
      level3: '#E0E0E0',
      level4: '#BDBDBD',
      level5: '#9E9E9E',
    },
  },
};

export const THEME_DARK = {
  ...THEME,
  colors: {
    ...THEME.colors,
    background: '#181818',
    text: '#FFFFFF',
    surface: '#222222',
    primary: '#FFFFFF',
    secondary: '#888888',
    elevation: {
      level0: 'transparent',
      level1: '#222222',
      level2: '#333333',
      level3: '#444444',
      level4: '#555555',
      level5: '#666666',
    },
  },
}; 