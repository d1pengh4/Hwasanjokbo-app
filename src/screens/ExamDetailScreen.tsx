import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { examAPI } from '../services/api';
import { authAPI } from '../services/auth';
import { ExamPaper } from '../types';
import { THEME } from '../config/env';
import Card from '../components/Card';
import Chip from '../components/Chip';
import GradientButton from '../components/GradientButton';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ExamDetailScreenProps {
  route: {
    params: {
      examId: string;
    };
  };
  navigation: any;
}

export default function ExamDetailScreen({ route, navigation }: ExamDetailScreenProps) {
  const { examId } = route.params;
  const [exam, setExam] = useState<ExamPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [liking, setLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const loadExamDetail = async () => {
    try {
      setLoading(true);
      const examData = await examAPI.getExamById(examId);
      setExam(examData);
    } catch (error) {
      console.error('Error loading exam detail:', error);
      Alert.alert('오류', '족보 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExamDetail();
  }, [examId]);

  const handleDownload = async () => {
    if (!exam || downloading) return;
    
    setDownloading(true);
    try {
      const currentUser = await authAPI.getCurrentUser();
      if (!currentUser) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }
      // 1. 파일 URL 확보
      const fileUrl = exam.file_url;
      if (!fileUrl) {
        Alert.alert('오류', '파일 URL이 없습니다.');
        return;
      }
      // 2. 저장 경로 지정
      const fileExtension = fileUrl.split('.').pop();
      // 파일명에 특수문자 제거 및 확장자 보존
      const safeTitle = (exam.title || '족보').replace(/[^a-zA-Z0-9가-힣_\-]/g, '_');
      const fileName = `${safeTitle}.${fileExtension}`;
      const fileUri = FileSystem.documentDirectory + fileName;
      // 3. 파일 다운로드
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        fileUri
      );
      await downloadResumable.downloadAsync();
      // 4. 다운로드 기록 저장 (기존 코드)
      await examAPI.downloadExam(examId, currentUser.id, {
        user_name: currentUser.user_metadata?.full_name || currentUser.email || '',
        user_student_id: currentUser.user_metadata?.student_id || '',
        exam_title: exam.title,
        exam_subject: exam.subject,
        exam_grade: exam.grade,
        exam_semester: exam.semester,
        exam_type: exam.file_type,
        points_spent: 0, // 포인트 시스템이 있다면 여기서 차감
      });
      // 5. 파일 공유 시트 띄우기
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('성공', `다운로드가 완료되었습니다!\n파일 위치: ${fileUri}`);
      }
    } catch (error: any) {
      console.error('Error downloading exam:', error);
      if (error.message?.includes('duplicate key')) {
        Alert.alert('알림', '이미 다운로드한 족보입니다.');
      } else {
        Alert.alert('오류', '다운로드에 실패했습니다.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleLike = async () => {
    if (!exam || liking) return;
    
    setLiking(true);
    try {
      const currentUser = await authAPI.getCurrentUser();
      if (!currentUser) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }
      
      if (isLiked) {
        // 좋아요 취소
        await examAPI.unlikeExam(examId, currentUser.id);
        setIsLiked(false);
        setExam(prev => prev ? { ...prev, likes: Math.max(0, prev.likes - 1) } : null);
      } else {
        // 좋아요 추가
        await examAPI.likeExam(examId, currentUser.id);
        setIsLiked(true);
        setExam(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      }
    } catch (error: any) {
      console.error('Error liking exam:', error);
      if (error.message?.includes('duplicate key')) {
        Alert.alert('알림', '이미 좋아요를 눌렀습니다.');
        setIsLiked(true);
      } else {
        Alert.alert('오류', '좋아요 처리에 실패했습니다.');
      }
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>족보 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (!exam) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={THEME.colors.error} />
        <Text style={styles.errorText}>족보를 찾을 수 없습니다.</Text>
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>족보 상세</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.mainCard} elevation="lg">
          <Text style={styles.title}>{exam.title}</Text>
          
          <View style={styles.chipContainer}>
            <Chip label={exam.subject} variant="primary" />
            <Chip label={exam.grade} variant="secondary" />
            <Chip label={`${exam.year}년 ${exam.semester}`} variant="primary" />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color={THEME.colors.textSecondary} />
              <Text style={styles.infoLabel}>교사</Text>
              <Text style={styles.infoValue}>{exam.teacher}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="document-outline" size={20} color={THEME.colors.textSecondary} />
              <Text style={styles.infoLabel}>파일 정보</Text>
              <Text style={styles.infoValue}>{exam.file_type} • {(exam.file_size / 1024 / 1024).toFixed(1)}MB</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="cloud-upload-outline" size={20} color={THEME.colors.textSecondary} />
              <Text style={styles.infoLabel}>업로더</Text>
              <Text style={styles.infoValue}>{exam.uploader_id}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={24} color={THEME.colors.primary} />
              <Text style={styles.statNumber}>{exam.views}</Text>
              <Text style={styles.statLabel}>조회수</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="download-outline" size={24} color={THEME.colors.success} />
              <Text style={styles.statNumber}>{exam.downloads}</Text>
              <Text style={styles.statLabel}>다운로드</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={24} color={THEME.colors.error} />
              <Text style={styles.statNumber}>{exam.likes}</Text>
              <Text style={styles.statLabel}>좋아요</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{exam.description}</Text>
        </Card>

        <View style={styles.actionContainer}>
          <GradientButton
            title="다운로드"
            onPress={handleDownload}
            loading={downloading}
            disabled={downloading}
            style={styles.downloadButton}
          />
          
          <TouchableOpacity
            style={[styles.likeButton, isLiked && styles.likedButton]}
            onPress={handleLike}
            disabled={liking}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? "white" : THEME.colors.error} 
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
  },
  errorText: {
    marginTop: THEME.spacing.md,
    ...THEME.typography.body,
    color: THEME.colors.error,
  },
  header: {
    paddingTop: 60,
    paddingBottom: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: THEME.spacing.md,
  },
  headerTitle: {
    ...THEME.typography.h2,
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    margin: THEME.spacing.lg,
    padding: THEME.spacing.xl,
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.lg,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: THEME.spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing.lg,
  },
  infoSection: {
    marginBottom: THEME.spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  infoLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginLeft: THEME.spacing.sm,
    marginRight: THEME.spacing.md,
    minWidth: 60,
  },
  infoValue: {
    ...THEME.typography.body,
    color: THEME.colors.text,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...THEME.typography.h2,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xs,
  },
  statLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  description: {
    ...THEME.typography.body,
    color: THEME.colors.text,
    lineHeight: 24,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  downloadButton: {
    flex: 1,
  },
  likeButton: {
    width: 56,
    height: 56,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.error,
    ...THEME.shadows.md,
  },
  likedButton: {
    backgroundColor: THEME.colors.error,
  },
}); 