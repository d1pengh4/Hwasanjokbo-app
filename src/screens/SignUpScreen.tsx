import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../config/env';
import Card from '../components/Card';
import Input from '../components/Input';
import GradientButton from '../components/GradientButton';
import { authAPI } from '../services/auth';

const { width, height } = Dimensions.get('window');

interface SignUpScreenProps {
  navigation: any;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    grade: '1학년',
    class: '1반',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = '학번을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { user, error } = await authAPI.signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        student_id: formData.studentId,
        grade: formData.grade,
        class: formData.class,
      });
      
      if (error) {
        Alert.alert('회원가입 실패', error.message);
      } else {
        Alert.alert('성공', '회원가입이 완료되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color={THEME.colors.text} />
            </TouchableOpacity>
            
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Ionicons name="library" size={width * 0.1} color={THEME.colors.primary} />
              </View>
              <Text style={styles.title}>가입하기</Text>
              <Text style={styles.subtitle}>
                화산족보 계정을 만들어{'\n'}시험지를 관리하세요
              </Text>
            </View>
          </View>

          {/* Sign Up Form */}
          <Card variant="elevated" padding="lg" style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>회원가입</Text>
              <Text style={styles.formSubtitle}>필요한 정보를 입력해주세요</Text>
            </View>
            <Input
              label="이름"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              leftIcon="person-outline"
              error={errors.name}
              variant="filled"
            />

            <Input
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
              variant="filled"
            />

            <Input
              label="학번"
              placeholder="학번을 입력하세요"
              value={formData.studentId}
              onChangeText={(value) => updateFormData('studentId', value)}
              keyboardType="numeric"
              leftIcon="school-outline"
              error={errors.studentId}
              variant="filled"
            />

            <Input
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry
              leftIcon="lock-closed-outline"
              error={errors.password}
              variant="filled"
            />

            <Input
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry
              leftIcon="lock-closed-outline"
              error={errors.confirmPassword}
              variant="filled"
            />

            <GradientButton
              title="회원가입"
              onPress={handleSignUp}
              loading={loading}
              variant="primary"
              size="lg"
              fullWidth
              style={styles.signupButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            <GradientButton
              title="로그인"
              onPress={() => navigation.navigate('Login')}
              variant="outline"
              size="lg"
              fullWidth
              style={styles.loginButton}
            />
          </Card>

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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
    minHeight: height * 0.8,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    paddingTop: THEME.spacing.sm,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: THEME.spacing.xl,
  },
  logoContainer: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: (width * 0.18) / 2,
    backgroundColor: THEME.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    ...THEME.typography.h2,
    color: THEME.colors.text,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    marginBottom: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
  },
  formHeader: {
    marginBottom: THEME.spacing.lg,
  },
  formTitle: {
    ...THEME.typography.h3,
    color: THEME.colors.text,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
  },
  formSubtitle: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.border,
  },
  dividerText: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginHorizontal: THEME.spacing.md,
  },
  loginButton: {
    borderColor: THEME.colors.border,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: THEME.spacing.lg,
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