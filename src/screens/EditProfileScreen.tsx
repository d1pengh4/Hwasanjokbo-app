import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { authAPI, AuthUser } from '../services/auth';

const EditProfileScreen = ({ navigation }: any) => {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await authAPI.getCurrentUser();
      if (user) {
        const profile = await authAPI.getUserProfile(user.id);
        setProfile(profile);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const updated = await authAPI.updateUserProfile(profile.id, profile);
    setSaving(false);
    if (updated) {
      Alert.alert('저장 완료', '프로필이 수정되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('오류', '프로필 저장에 실패했습니다.');
    }
  };

  if (loading || !profile) return <View style={styles.container}><Text>로딩 중...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>이름</Text>
      <TextInput style={styles.input} value={profile.name} onChangeText={name => setProfile({ ...profile, name })} />
      <Text style={styles.label}>이메일</Text>
      <TextInput style={styles.input} value={profile.email} editable={false} />
      <Text style={styles.label}>학번</Text>
      <TextInput style={styles.input} value={profile.student_id} onChangeText={student_id => setProfile({ ...profile, student_id })} />
      <Text style={styles.label}>학년</Text>
      <TextInput style={styles.input} value={profile.grade} onChangeText={grade => setProfile({ ...profile, grade })} />
      <Text style={styles.label}>반</Text>
      <TextInput style={styles.input} value={profile.class} onChangeText={cls => setProfile({ ...profile, class: cls })} />
      <Button title={saving ? '저장 중...' : '저장'} onPress={handleSave} disabled={saving} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  label: { fontWeight: 'bold', marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 4 },
});

export default EditProfileScreen; 