import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { authAPI, AuthUser } from '../services/auth';
import { THEME } from '../config/env';

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserProfile = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      if (currentUser) {
        const profile = await authAPI.getUserProfile(currentUser.id);
        setUser(profile);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await authAPI.signOut();
              if (error) {
                Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
              }
              // 네비게이션은 AppNavigator에서 자동으로 처리됨
            } catch (error) {
              Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      '계정 삭제',
      '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await authAPI.deleteAccount();
              if (error) {
                Alert.alert('오류', '계정 삭제 중 오류가 발생했습니다.');
              } else {
                // 로그아웃 처리
                await authAPI.signOut();
              }
            } catch (error) {
              Alert.alert('오류', '계정 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>프로필을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.charAt(0) || 'U'} 
          style={styles.avatar}
        />
        <Title style={styles.name}>{user?.name || '사용자'}</Title>
        <Paragraph style={styles.email}>{user?.email}</Paragraph>
      </View>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          ※ 프로필, 족보, 질문 등 주요 정보 수정 후에는 새로고침(아래로 당기기)을 해야 변경사항이 반영됩니다.
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>학생 정보</Title>
          <View style={styles.infoRow}>
            <Ionicons name="card" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>학번:</Text>
            <Text style={styles.infoValue}>{user?.student_id || '미설정'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="school" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>학년:</Text>
            <Text style={styles.infoValue}>{user?.grade || '미설정'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>반:</Text>
            <Text style={styles.infoValue}>{user?.class || '미설정'}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>계정 관리</Title>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditProfileScreen')}
            style={styles.menuButton}
            icon="account-edit"
          >
            프로필 수정
          </Button>

          <Divider style={styles.divider} />

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('MyUploadsScreen')}
            style={styles.menuButton}
            icon="cloud-upload"
          >
            내가 업로드한 족보
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('MyQuestionsScreen')}
            style={styles.menuButton}
            icon="help-circle"
          >
            내가 작성한 질문
          </Button>

          <Divider style={styles.divider} />

          <Button
            mode="outlined"
            onPress={handleDeleteAccount}
            style={[styles.menuButton, styles.logoutButton]}
            icon="delete"
            textColor={THEME.colors.error}
          >
            내 계정 삭제
          </Button>

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={[styles.menuButton, styles.logoutButton]}
            icon="logout"
            textColor={THEME.colors.error}
          >
            로그아웃
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: THEME.colors.primary,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: THEME.colors.surface,
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: THEME.colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 8,
    color: THEME.colors.text,
  },
  infoValue: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  menuButton: {
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  logoutButton: {
    borderColor: THEME.colors.error,
  },
  noticeBox: {
    backgroundColor: '#FFFBEA',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFE58F',
  },
  noticeText: {
    color: '#B8860B',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default ProfileScreen; 