import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  HelperText,
} from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { examAPI } from '../services/api';
import { authAPI } from '../services/auth';
import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system';

const UploadScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [examType, setExamType] = useState('');
  const [customExamType, setCustomExamType] = useState('');
  const [teacher, setTeacher] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const subjects = ['국어', '수학', '영어', '사회', '과학', '정보', '일본어', '중국어', '한문', '역사', '기타'];
  const grades = ['1학년', '2학년', '3학년'];
  const semesters = ['1학기', '2학기'];
  const examTypes = ['중간고사', '기말고사', '모의고사', '쪽지시험', '수행평가', '단원평가', '기타'];

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedFile(file);
      }
    } catch (error) {
      Alert.alert('오류', '파일 선택 중 오류가 발생했습니다.');
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요.');
      return false;
    }
    if (!subject || (subject === '기타' && !customSubject.trim())) {
      Alert.alert('오류', '과목을 선택하거나 직접 입력해주세요.');
      return false;
    }
    if (!grade) {
      Alert.alert('오류', '학년을 선택해주세요.');
      return false;
    }
    if (!year.trim()) {
      Alert.alert('오류', '연도를 입력해주세요.');
      return false;
    }
    if (!semester) {
      Alert.alert('오류', '학기를 선택해주세요.');
      return false;
    }
    if (!examType || (examType === '기타' && !customExamType.trim())) {
      Alert.alert('오류', '시험 유형을 선택하거나 직접 입력해주세요.');
      return false;
    }
    if (!selectedFile) {
      Alert.alert('오류', '파일을 선택해주세요.');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setUploading(true);
    try {
      const currentUser = await authAPI.getCurrentUser();
      if (!currentUser) {
        Alert.alert('오류', '로그인이 필요합니다.');
        setUploading(false);
        return;
      }
      if (!selectedFile) {
        Alert.alert('오류', '파일을 선택해주세요.');
        setUploading(false);
        return;
      }
      // 1. 파일을 base64로 읽기
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${currentUser.id}.${fileExt}`;
      const filePath = `${fileName}`;
      let fileData;
      try {
        fileData = await FileSystem.readAsStringAsync(selectedFile.uri, { encoding: FileSystem.EncodingType.Base64 });
      } catch (e) {
        Alert.alert('오류', '파일을 읽는 데 실패했습니다.');
        setUploading(false);
        return;
      }
      // 2. base64 string을 그대로 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('exam-papers')
        .upload(filePath, fileData, {
          contentType: selectedFile.mimeType,
          upsert: true,
        });
      if (uploadError) {
        Alert.alert('오류', `파일 업로드에 실패했습니다. (${uploadError.message})`);
        setUploading(false);
        return;
      }
      // 3. 퍼블릭 URL 생성
      const { data: publicUrlData } = supabase.storage.from('exam-papers').getPublicUrl(filePath);
      const publicURL = publicUrlData?.publicUrl;
      if (!publicURL) {
        Alert.alert('오류', '퍼블릭 URL 생성에 실패했습니다.');
        setUploading(false);
        return;
      }
      // 4. DB에 퍼블릭 URL 저장
      const examData = {
        title: title.trim(),
        subject: subject === '기타' ? customSubject.trim() : subject,
        grade,
        year: year.trim(),
        semester,
        exam_type: examType === '기타' ? customExamType.trim() : examType,
        teacher: teacher.trim(),
        description: description.trim(),
        file_url: publicURL,
        file_type: selectedFile.mimeType || 'application/pdf',
        file_size: selectedFile.size || 0,
        uploader_id: currentUser.id,
        approved: true,
      };
      await examAPI.uploadExam(examData);
      Alert.alert(
        '업로드 완료',
        '족보가 성공적으로 업로드되었습니다!',
        [
          {
            text: '확인',
            onPress: () => {
              setTitle('');
              setSubject('');
              setCustomSubject('');
              setGrade('');
              setYear('');
              setSemester('');
              setExamType('');
              setCustomExamType('');
              setTeacher('');
              setDescription('');
              setSelectedFile(null);
              navigation.navigate('HomeTab');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('오류', `업로드 중 오류가 발생했습니다. 다시 시도해주세요.\n\n${error?.message || error}`);
    } finally {
      setUploading(false);
    }
  };

  const renderSubjectSelector = () => (
    <View style={styles.chipSelector}>
      <Text style={styles.chipSelectorTitle}>과목</Text>
      <View style={styles.chipContainer}>
        {subjects.map((option) => (
          <Chip
            key={option}
            mode={subject === option ? 'flat' : 'outlined'}
            style={[styles.chip, subject === option && styles.selectedChip]}
            textStyle={subject === option ? styles.selectedChipText : undefined}
            onPress={() => {
              setSubject(option);
              if (option !== '기타') setCustomSubject('');
            }}
          >
            {option}
          </Chip>
        ))}
      </View>
      {subject === '기타' && (
        <TextInput
          label="직접 입력"
          value={customSubject}
          onChangeText={setCustomSubject}
          mode="outlined"
          style={styles.input}
          placeholder="과목명을 입력하세요"
        />
      )}
    </View>
  );

  const renderChipSelector = (
    title: string,
    options: string[],
    selected: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.chipSelector}>
      <Text style={styles.chipSelectorTitle}>{title}</Text>
      <View style={styles.chipContainer}>
        {options.map((option) => (
          <Chip
            key={option}
            mode={selected === option ? 'flat' : 'outlined'}
            style={[styles.chip, selected === option && styles.selectedChip]}
            textStyle={selected === option ? styles.selectedChipText : undefined}
            onPress={() => onSelect(selected === option ? '' : option)}
          >
            {option}
          </Chip>
        ))}
      </View>
    </View>
  );

  const renderExamTypeSelector = () => (
    <View style={styles.chipSelector}>
      <Text style={styles.chipSelectorTitle}>시험 유형</Text>
      <View style={styles.chipContainer}>
        {examTypes.map((option) => (
          <Chip
            key={option}
            mode={examType === option ? 'flat' : 'outlined'}
            style={[styles.chip, examType === option && styles.selectedChip]}
            textStyle={examType === option ? styles.selectedChipText : undefined}
            onPress={() => {
              setExamType(option);
              if (option !== '기타') setCustomExamType('');
            }}
          >
            {option}
          </Chip>
        ))}
      </View>
      {examType === '기타' && (
        <TextInput
          label="직접 입력"
          value={customExamType}
          onChangeText={setCustomExamType}
          mode="outlined"
          style={styles.input}
          placeholder="시험 종류를 입력하세요"
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>족보 업로드</Text>
        <Text style={styles.headerSubtitle}>
          새로운 족보를 업로드하여 다른 학생들과 공유하세요
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>기본 정보</Title>
          
          <TextInput
            label="족보 제목"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="예: 2024년 1학기 중간고사 수학"
          />

          {renderSubjectSelector()}
          {renderChipSelector('학년', grades, grade, setGrade)}

          <TextInput
            label="연도"
            value={year}
            onChangeText={setYear}
            mode="outlined"
            style={styles.input}
            placeholder="예: 2024"
            keyboardType="numeric"
          />

          {renderChipSelector('학기', semesters, semester, setSemester)}
          {renderExamTypeSelector()}

          <TextInput
            label="담당 선생님 (선택사항)"
            value={teacher}
            onChangeText={setTeacher}
            mode="outlined"
            style={styles.input}
            placeholder="예: 김수학"
          />

          <TextInput
            label="설명 (선택사항)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            placeholder="족보에 대한 추가 설명을 입력하세요"
            multiline
            numberOfLines={3}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>파일 업로드</Title>
          
          <Button
            mode="outlined"
            onPress={pickDocument}
            style={styles.fileButton}
            icon="file-upload"
          >
            파일 선택
          </Button>

          {selectedFile && (
            <View style={styles.fileInfo}>
              <Ionicons name="document-outline" size={24} color="#1976d2" />
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{selectedFile.name}</Text>
                <Text style={styles.fileSize}>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </View>
            </View>
          )}

          <HelperText type="info">
            PDF 또는 이미지 파일을 업로드할 수 있습니다.
          </HelperText>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleUpload}
        loading={uploading}
        disabled={uploading}
        style={styles.uploadButton}
        contentStyle={styles.uploadButtonContent}
      >
        {uploading ? '업로드 중...' : '족보 업로드'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    margin: 20,
    marginTop: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    marginBottom: 15,
  },
  chipSelector: {
    marginBottom: 15,
  },
  chipSelectorTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#1976d2',
  },
  selectedChipText: {
    color: 'white',
  },
  fileButton: {
    marginBottom: 15,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  uploadButton: {
    margin: 20,
    marginTop: 10,
  },
  uploadButtonContent: {
    paddingVertical: 8,
  },
});

export default UploadScreen; 