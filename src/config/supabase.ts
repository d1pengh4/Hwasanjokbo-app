import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// 깃허브 공개용: 환경변수에서 Supabase 정보 불러오기 (env.ts에서 예시값 사용)
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

// Supabase 연결 테스트 함수
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.log('Connection test error:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.log('Connection test failed:', error);
    return { success: false, error };
  }
};

// 모든 테이블 확인 함수
export const checkAllTables = async () => {
  const tables = [
    'profiles',
    'exam_papers', 
    'questions',
    'answers',
    'exam_comments',
    'exam_likes',
    'exam_downloads',
    'question_likes',
    'answer_likes'
  ];

  for (const table of tables) {
    try {
      console.log(`Checking if table ${table} exists...`);
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.log(`Table ${table} error:`, error);
      } else {
        console.log(`${table}: OK`);
      }
    } catch (error) {
      console.log(`Table ${table} check failed:`, error);
    }
  }
};

export default supabase; 