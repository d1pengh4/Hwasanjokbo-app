import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../config/supabase';
import { authAPI } from '../services/auth';

const MyUploadsScreen = () => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await authAPI.getCurrentUser();
      if (user) {
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .eq('uploader_id', user.id)
          .order('created_at', { ascending: false });
        if (!error) setUploads(data || []);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={styles.container}><Text>로딩 중...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내가 업로드한 족보</Text>
      <FlatList
        data={uploads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.examTitle}>{item.title}</Text>
            <Text style={styles.examInfo}>{item.subject} | {item.year}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>업로드한 족보가 없습니다.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  examTitle: { fontWeight: 'bold', fontSize: 16 },
  examInfo: { color: '#888', marginTop: 4 },
});

export default MyUploadsScreen; 