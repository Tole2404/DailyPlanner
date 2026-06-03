'use client';

import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  totalTasks: number;
  completedTasks: number;
  streakDays: number;
}

export function StatsCards({ totalTasks, completedTasks, streakDays }: StatsCardsProps) {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Today's Progress */}
      <div className="bg-white dark:bg-surface rounded-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-button bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm text-dark/60 font-medium">Task Hari Ini</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-heading font-bold text-dark">
            {completedTasks}
          </span>
          <span className="text-lg text-dark/40 mb-1">/ {totalTasks}</span>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-dark/50">{progress}% selesai</p>
      </div>

      {/* Streak */}
      <div className="bg-white dark:bg-surface rounded-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-button bg-priority-low/10">
            <TrendingUp className="w-5 h-5 text-priority-low" />
          </div>
          <span className="text-sm text-dark/60 font-medium">Streak Harian</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-heading font-bold text-dark">{streakDays}</span>
          <span className="text-lg text-dark/40 mb-1">hari</span>
        </div>
        <p className="mt-2 text-xs text-dark/50">
          {streakDays > 0 ? `${streakDays} hari berturut-turut produktif! 🔥` : 'Mulai besok untuk streak pertamamu!'}
        </p>
      </div>

      {/* Upcoming */}
      <div className="bg-white dark:bg-surface rounded-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-button bg-cat-belajar/10">
            <Clock className="w-5 h-5 text-cat-belajar" />
          </div>
          <span className="text-sm text-dark/60 font-medium">Task Mendatang</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-heading font-bold text-dark">{totalTasks - completedTasks}</span>
          <span className="text-lg text-dark/40 mb-1">task</span>
        </div>
        <p className="mt-2 text-xs text-dark/50">Belum diselesaikan</p>
      </div>
    </div>
  );
}
