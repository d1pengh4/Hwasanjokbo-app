import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../config/supabase';
import { authAPI } from '../services/auth';

const MyQuestionsScreen = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await authAPI.getCurrentUser();
      if (user) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (!error) setQuestions(data || []);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={styles.container}><Text>로딩 중...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내가 작성한 질문</Text>
      <FlatList
        data={questions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.questionTitle}>{item.title}</Text>
            <Text style={styles.questionContent}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>작성한 질문이 없습니다.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  questionTitle: { fontWeight: 'bold', fontSize: 16 },
  questionContent: { color: '#888', marginTop: 4 },
});

export default MyQuestionsScreen; 