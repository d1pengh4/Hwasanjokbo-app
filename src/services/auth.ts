import { supabase } from '../config/supabase';

          id: user.id,
          name: signUpData.name,
          student_id: signUpData.student_id,
          grade: signUpData.grade,
          class: signUpData.class,
          email: signUpData.email,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // 프로필 생성 실패 시 사용자 삭제
        await supabase.auth.admin.deleteUser(user.id);
        return { user: null, error: profileError };
      }

      return { user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error };
    }
  },

  // 로그인
  async signIn(signInData: SignInData): Promise<{ user: User | null; error: any }> {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) {
        console.error('Signin error:', error);
        return { user: null, error };
      }

      return { user, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { user: null, error };
    }
  },

  // 로그아웃
  async signOut(): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.error('Signout error:', error);
      return { error };
    }
  },

  // 비밀번호 재설정
  async resetPassword(email: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'hwasanjokbo://reset-password',
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error };
    }
  },

  // 사용자 프로필 가져오기
  async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Failed to get user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  },

  // 사용자 프로필 업데이트
  async updateUserProfile(userId: string, updates: Partial<AuthUser>): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Failed to update user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return null;
    }
  },

  // 계정 삭제
  async deleteAccount(): Promise<{ error: any }> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return { error: { message: '사용자 정보를 찾을 수 없습니다.' } };
      }
      // 1. profiles 테이블에서 사용자 정보 삭제
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      if (profileError) {
        return { error: profileError };
      }
      // 2. Supabase Auth에서 사용자 삭제
      // (관리자 권한 필요, 일반적으로 클라이언트에서 직접 불가)
      // 만약 서버리스 함수나 백엔드 API가 있다면 거기로 요청 필요
      // 여기서는 세션 삭제만 처리
      const { error: authError } = await supabase.auth.signOut();
      return { error: authError };
    } catch (error) {
      return { error };
    }
  },
};

// 인증 상태 변경 리스너
export const authListener = {
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
}; 