import { TaskInsert } from './types';

export interface TaskTemplate {
  id: string;
  name: string;
  icon: string;
  category: 'kerja' | 'pribadi' | 'kesehatan' | 'belajar' | 'lain';
  tasks: Omit<TaskInsert, 'user_id' | 'date'>[];
}

export const taskTemplates: TaskTemplate[] = [
  {
    id: 'gym-session',
    name: 'Gym Session',
    icon: '💪',
    category: 'kesehatan',
    tasks: [
      {
        title: 'Perjalanan ke Gym',
        description: 'Persiapan dan perjalanan menuju gym',
        time_start: '13:00',
        time_end: '14:00',
        category: 'kesehatan',
        priority: 'medium',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Gym Workout',
        description: 'Cardio 20 menit + strength training + stretching',
        time_start: '14:00',
        time_end: '16:00',
        category: 'kesehatan',
        priority: 'high',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Recovery & Cool Down',
        description: 'Mandi, protein shake, istirahat',
        time_start: '16:00',
        time_end: '16:30',
        category: 'kesehatan',
        priority: 'medium',
        status: 'pending',
        reminder: null,
      },
    ],
  },
  {
    id: 'cpns-study',
    name: 'Belajar CPNS',
    icon: '📚',
    category: 'belajar',
    tasks: [
      {
        title: 'Belajar CPNS - TWK',
        description: 'Tes Wawasan Kebangsaan: Pancasila, UUD 1945, Bhineka Tunggal Ika, NKRI',
        time_start: '19:00',
        time_end: '20:00',
        category: 'belajar',
        priority: 'high',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Belajar CPNS - TIU',
        description: 'Tes Intelegensia Umum: numerik, verbal, logika, analogi',
        time_start: '20:00',
        time_end: '21:00',
        category: 'belajar',
        priority: 'high',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Belajar CPNS - TKP',
        description: 'Tes Karakteristik Pribadi: integritas, kerjasama, komunikasi, orientasi pelayanan',
        time_start: '21:00',
        time_end: '22:00',
        category: 'belajar',
        priority: 'high',
        status: 'pending',
        reminder: null,
      },
    ],
  },
  {
    id: 'english-study',
    name: 'Belajar Bahasa Inggris',
    icon: '🇬🇧',
    category: 'belajar',
    tasks: [
      {
        title: 'English Speaking Practice',
        description: 'Conversation practice, pronunciation drills',
        time_start: '17:00',
        time_end: '17:30',
        category: 'belajar',
        priority: 'high',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'English Listening',
        description: 'Podcast, video, comprehension exercises',
        time_start: '17:30',
        time_end: '18:00',
        category: 'belajar',
        priority: 'high',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Grammar & Vocabulary',
        description: 'Grammar exercises, new words, writing practice',
        time_start: '18:00',
        time_end: '18:45',
        category: 'belajar',
        priority: 'high',
        status: 'pending',
        reminder: null,
      },
    ],
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    icon: '☀️',
    category: 'pribadi',
    tasks: [
      {
        title: 'Bangun & Mandi',
        description: 'Bangun pagi, mandi, siap-siap',
        time_start: '06:00',
        time_end: '06:30',
        category: 'pribadi',
        priority: 'medium',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Sarapan Sehat',
        description: 'Sarapan bergizi, minum air putih',
        time_start: '06:30',
        time_end: '07:00',
        category: 'pribadi',
        priority: 'medium',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Planning Hari Ini',
        description: 'Review jadwal, prioritas task, mental prep',
        time_start: '07:00',
        time_end: '07:30',
        category: 'pribadi',
        priority: 'high',
        status: 'pending',
        reminder: null,
      },
    ],
  },
  {
    id: 'evening-routine',
    name: 'Evening Routine',
    icon: '🌙',
    category: 'pribadi',
    tasks: [
      {
        title: 'Review Hari Ini',
        description: 'Catat pencapaian, evaluasi progress',
        time_start: '21:30',
        time_end: '22:00',
        category: 'pribadi',
        priority: 'medium',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Planning Besok',
        description: 'Buat jadwal besok, prioritas utama',
        time_start: '22:00',
        time_end: '22:15',
        category: 'pribadi',
        priority: 'medium',
        status: 'pending',
        reminder: null,
      },
      {
        title: 'Wind Down',
        description: 'Relax, baca buku, no screen time',
        time_start: '22:15',
        time_end: '22:45',
        category: 'pribadi',
        priority: 'low',
        status: 'pending',
        reminder: null,
      },
    ],
  },
];

export function getTemplateById(id: string): TaskTemplate | undefined {
  return taskTemplates.find((t) => t.id === id);
}
