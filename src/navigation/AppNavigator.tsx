import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';
import { THEME } from '../config/env';

// Screens
import LandingScreen from '../screens/LandingScreen';
import HomeScreen from '../screens/HomeScreen';
import JokboScreen from '../screens/JokboScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ExamDetailScreen from '../screens/ExamDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MyUploadsScreen from '../screens/MyUploadsScreen';
import MyQuestionsScreen from '../screens/MyQuestionsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Landing" component={LandingScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'HomeTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'JokboTab') {
          iconName = focused ? 'library' : 'library-outline';
        } else if (route.name === 'UploadTab') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'ProfileTab') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: THEME.colors.primary,
      tabBarInactiveTintColor: THEME.colors.textTertiary,
      tabBarStyle: {
        backgroundColor: THEME.colors.surface,
        borderTopColor: THEME.colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
        ...THEME.shadows.lg,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600' as const,
        marginTop: 4,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="HomeTab" 
      component={HomeScreen}
      options={{ tabBarLabel: '홈' }}
    />
    <Tab.Screen 
      name="JokboTab" 
      component={JokboScreen}
      options={{ tabBarLabel: '족보' }}
    />
    <Tab.Screen 
      name="UploadTab" 
      component={UploadScreen}
      options={{ tabBarLabel: '업로드' }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileScreen}
      options={{ tabBarLabel: '프로필' }}
    />
  </Tab.Navigator>
);

// Main Stack Navigator
const MainStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: THEME.colors.primary,
        ...THEME.shadows.md,
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold' as const,
        fontSize: 18,
      },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ExamDetail" 
      component={ExamDetailScreen as any}
      options={{ 
        title: '족보 상세',
        headerShown: false,
      }}
    />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen name="MyUploadsScreen" component={MyUploadsScreen} />
    <Stack.Screen name="MyQuestionsScreen" component={MyQuestionsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Show loading screen while checking auth state
  if (isAuthenticated === null) {
    return null; // or a loading component
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStackNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator; 