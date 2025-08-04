export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  student_id: string;
  student_number: number;
  email: string;
  grade: string;
  class: string;
  avatar_url: string;
  uploaded_exams_count: number;
}

export interface ExamPaper {
  id: string;
  title: string;
  subject: string;
  grade: string;
  year: string;
  semester: string;
  exam_type: string;
  teacher: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploader_id: string;
  views: number;
  downloads: number;
  likes: number;
  dislikes: number;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamComment {
  id: string;
  exam_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ExamLike {
  id: string;
  exam_id: string;
  user_id: string;
  created_at: string;
}

export interface ExamDownload {
  id: string;
  exam_id: string;
  user_id: string;
  user_name: string;
  user_student_id: string;
  exam_title: string;
  exam_subject: string;
  exam_grade: string;
  exam_semester: string;
  exam_type: string;
  points_spent: number;
  downloaded_at: string;
}

export interface SavedQuery {
  id: string;
  user_id: string;
  name: string;
  query: string;
  created_at: string;
} 