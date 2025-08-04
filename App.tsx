import React, { useEffect, useState, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { THEME_LIGHT, THEME_DARK } from './src/config/env';

export const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
});

export function useThemeMode() {
  return useContext(ThemeContext);
}

export default function App() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => setDark((d) => !d);

  useEffect(() => {
    // 앱 시작 시 Supabase 연결 테스트
    const testConnection = async () => {
      const { testSupabaseConnection, checkAllTables } = await import('./src/config/supabase');
      console.log('=== Supabase Connection Test ===');
      const result = await testSupabaseConnection();
      if (result.success) {
        console.log('✅ Supabase connection successful');
        await checkAllTables();
      } else {
        console.log('❌ Supabase connection failed:', result.error);
      }
      console.log('=== End Connection Test ===');
    };
    testConnection();
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
          <PaperProvider theme={dark ? THEME_DARK : THEME_LIGHT}>
            <StatusBar style={dark ? 'light' : 'dark'} />
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
    </ThemeContext.Provider>
  );
} 