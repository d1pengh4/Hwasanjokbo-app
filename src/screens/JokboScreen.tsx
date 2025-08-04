import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Searchbar, Card, Title, Paragraph, Chip, FAB, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { examAPI } from '../services/api';
import { ExamPaper } from '../types';

const JokboScreen = ({ navigation }: any) => {
  const [exams, setExams] = useState<ExamPaper[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamPaper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subjects = ['전체', '수학', '영어', '국어', '과학', '사회', '기타'];

  const loadExams = async () => {
    try {
      const data = await examAPI.getExams(50);
      setExams(data);
      setFilteredExams(data);
      setErrorMsg(null);
    } catch (error) {
      console.error('Error loading exams:', error);
      setErrorMsg('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExams();
    setRefreshing(false);
  };

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    let filtered = exams;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubject && selectedSubject !== '전체') {
      filtered = filtered.filter(exam => exam.subject === selectedSubject);
    }

    setFilteredExams(filtered);
  }, [searchQuery, selectedSubject, exams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderExamItem = ({ item }: { item: ExamPaper }) => {
    if (!item || !item.id || !item.title) return null;
    return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ExamDetail', { examId: item.id })}
    >
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Title>
            <Chip mode="outlined" style={styles.chip}>
              {item.subject}
            </Chip>
          </View>
          <Paragraph style={styles.cardSubtitle}>
            {item.grade} • {item.year}년 {item.semester}학기 • {item.exam_type}
          </Paragraph>
          {item.description && (
            <Paragraph style={styles.description} numberOfLines={2}>
              {item.description}
            </Paragraph>
          )}
          <View style={styles.cardFooter}>
            <View style={styles.stats}>
              <Ionicons name="eye-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.views}</Text>
              <Ionicons name="heart-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.likes}</Text>
              <Ionicons name="download-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.downloads}</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
  };

  const renderSubjectChip = (subject: string) => (
    <TouchableOpacity
      key={subject}
      onPress={() => setSelectedSubject(selectedSubject === subject ? '' : subject)}
    >
      <Chip
        mode={selectedSubject === subject ? 'flat' : 'outlined'}
        style={[
          styles.subjectChip,
          selectedSubject === subject && styles.selectedChip,
        ]}
        textStyle={selectedSubject === subject ? styles.selectedChipText : undefined}
      >
        {subject}
      </Chip>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>족보</Text>
        <Searchbar
          placeholder="족보 검색..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <View style={styles.subjectFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {subjects.map(renderSubjectChip)}
          </ScrollView>
        </View>
      </View>

      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <FlatList
        data={filteredExams.filter(e => !!e && !!e.id && !!e.title)}
        renderItem={renderExamItem}
        keyExtractor={(item) => item.id || Math.random().toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery || selectedSubject ? '검색 결과가 없습니다.' : '등록된 족보가 없습니다.'}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('UploadTab')}
      />
    </View>
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
    marginBottom: 15,
  },
  searchbar: {
    marginBottom: 15,
  },
  subjectFilter: {
    marginBottom: 10,
  },
  subjectChip: {
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#2196f3',
  },
  selectedChipText: {
    color: 'white',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  cardSubtitle: {
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
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
  statText: {
    marginLeft: 4,
    marginRight: 12,
    color: '#666',
    fontSize: 12,
  },
  dateText: {
    color: '#999',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#FFBABA',
  },
  errorText: {
    color: '#D8000C',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default JokboScreen; 