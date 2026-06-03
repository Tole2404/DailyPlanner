export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          date: string;
          time_start: string | null;
          time_end: string | null;
          category: 'kerja' | 'pribadi' | 'kesehatan' | 'belajar' | 'lain';
          priority: 'low' | 'medium' | 'high';
          status: 'pending' | 'in_progress' | 'completed' | 'overdue';
          reminder: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          date: string;
          time_start?: string | null;
          time_end?: string | null;
          category?: 'kerja' | 'pribadi' | 'kesehatan' | 'belajar' | 'lain';
          priority?: 'low' | 'medium' | 'high';
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
          reminder?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          time_start?: string | null;
          time_end?: string | null;
          category?: 'kerja' | 'pribadi' | 'kesehatan' | 'belajar' | 'lain';
          priority?: 'low' | 'medium' | 'high';
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
          reminder?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          theme: 'light' | 'dark' | 'system';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          theme?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          theme?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export type Category = Task['category'];
export type Priority = Task['priority'];
export type Status = Task['status'];

export const CATEGORY_LABELS: Record<Category, string> = {
  kerja: 'Kerja',
  pribadi: 'Pribadi',
  kesehatan: 'Kesehatan',
  belajar: 'Belajar',
  lain: 'Lainnya',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  kerja: '#3F72AF',
  pribadi: '#A78BFA',
  kesehatan: '#6EE7B7',
  belajar: '#FCD34D',
  lain: '#94A3B8',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#F87171',
  medium: '#FB923C',
  low: '#4ADE80',
};

export const STATUS_LABELS: Record<Status, string> = {
  pending: 'Belum',
  in_progress: 'Proses',
  completed: 'Selesai',
  overdue: 'Terlambat',
};
