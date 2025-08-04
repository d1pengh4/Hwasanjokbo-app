import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { examAPI } from '../services/api';
import { ExamPaper } from '../types';
import { THEME } from '../config/env';
import Card from '../components/Card';
import Chip from '../components/Chip';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [latestExams, setLatestExams] = useState<ExamPaper[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const exams = await examAPI.getExams(10);
      setLatestExams(exams);
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError('데이터를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderExamCard = (exam: ExamPaper) => (
    <TouchableOpacity
      key={exam.id}
      onPress={() => navigation.navigate('ExamDetail', { examId: exam.id })}
      style={styles.cardTouchable}
      activeOpacity={0.8}
    >
      <Card style={styles.card} elevation="md">
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {exam.title}
            </Text>
            <Chip label={exam.subject} variant="primary" />
          </View>
        </View>
        
        <Text style={styles.cardSubtitle}>
          {exam.grade} • {exam.year}년 {exam.semester}학기 • {exam.exam_type}
        </Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={16} color={THEME.colors.textTertiary} />
              <Text style={styles.statText}>{exam.views}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={16} color={THEME.colors.textTertiary} />
              <Text style={styles.statText}>{exam.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="download-outline" size={16} color={THEME.colors.textTertiary} />
              <Text style={styles.statText}>{exam.downloads}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{formatDate(exam.created_at)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.primary} />
      
      <LinearGradient
        colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>화산족보</Text>
          <Text style={styles.headerSubtitle}>최신 족보를 확인하세요</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <Card style={styles.errorCard} elevation="sm">
            <View style={styles.errorContainer}>
              <Ionicons name="warning-outline" size={24} color={THEME.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </Card>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최신 족보</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('JokboTab')}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>전체보기</Text>
              <Ionicons name="chevron-forward" size={16} color={THEME.colors.primary} />
            </TouchableOpacity>
          </View>
          {latestExams.length > 0 ? (
            latestExams.map(renderExamCard)
          ) : (
            <Card style={styles.emptyCard} elevation="sm">
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={48} color={THEME.colors.textTertiary} />
                <Text style={styles.emptyText}>등록된 족보가 없습니다</Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
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
  loadingText: {
    marginTop: THEME.spacing.md,
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    ...THEME.typography.h1,
    color: 'white',
    marginBottom: THEME.spacing.sm,
  },
  headerSubtitle: {
    ...THEME.typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
  },
  errorCard: {
    marginBottom: THEME.spacing.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  errorText: {
    marginLeft: THEME.spacing.sm,
    ...THEME.typography.caption,
    color: THEME.colors.error,
  },
  section: {
    marginBottom: THEME.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    ...THEME.typography.h2,
    color: THEME.colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    ...THEME.typography.caption,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  cardTouchable: {
    marginBottom: THEME.spacing.md,
  },
  card: {
    padding: THEME.spacing.lg,
  },
  cardHeader: {
    marginBottom: THEME.spacing.sm,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    ...THEME.typography.h3,
    color: THEME.colors.text,
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  cardSubtitle: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  statText: {
    ...THEME.typography.small,
    color: THEME.colors.textTertiary,
    marginLeft: THEME.spacing.xs,
  },
  dateText: {
    ...THEME.typography.small,
    color: THEME.colors.textTertiary,
  },
  emptyCard: {
    padding: THEME.spacing.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    marginTop: THEME.spacing.md,
    ...THEME.typography.body,
    color: THEME.colors.textTertiary,
  },
});

export default HomeScreen; 