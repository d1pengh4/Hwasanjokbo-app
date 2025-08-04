import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../config/env';
import GradientButton from '../components/GradientButton';

const { width, height } = Dimensions.get('window');

interface LandingScreenProps {
  navigation: any;
}

export default function LandingScreen({ navigation }: LandingScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      {/* Main Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="library" size={width * 0.15} color={THEME.colors.primary} />
          </View>
          <Text style={styles.title}>화산족보</Text>
          <Text style={styles.subtitle}>
            학교 시험지를 연결하고 보존하는{'\n'}가장 쉬운 방법
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="library-outline" size={width * 0.06} color={THEME.colors.primary} />
              </View>
              <Text style={styles.featureText}>시험지 관리</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="people-outline" size={width * 0.06} color={THEME.colors.primary} />
              </View>
              <Text style={styles.featureText}>학습 공유</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="document-text-outline" size={width * 0.06} color={THEME.colors.primary} />
              </View>
              <Text style={styles.featureText}>기록 보존</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="share-outline" size={width * 0.06} color={THEME.colors.primary} />
              </View>
              <Text style={styles.featureText}>정보 공유</Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaContainer}>
          <GradientButton
            title="시작하기"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.primaryButton}
          />
          <GradientButton
            title="회원가입"
            onPress={() => navigation.navigate('SignUp')}
            variant="outline"
            size="lg"
            fullWidth
            style={styles.secondaryButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            이미 계정이 있으신가요?{' '}
            <Text 
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login')}
            >
              로그인
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    justifyContent: 'space-between',
    paddingTop: height * 0.05,
    paddingBottom: height * 0.05,
  },
  header: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    backgroundColor: THEME.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    marginVertical: THEME.spacing.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  featureIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    backgroundColor: THEME.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.sm,
  },
  featureText: {
    ...THEME.typography.captionMedium,
    color: THEME.colors.text,
    textAlign: 'center',
  },
  ctaContainer: {
    marginBottom: THEME.spacing.lg,
  },
  primaryButton: {
    marginBottom: THEME.spacing.md,
  },
  secondaryButton: {
    borderColor: THEME.colors.border,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  footerLink: {
    color: THEME.colors.primary,
    fontWeight: '600',
  },
}); 