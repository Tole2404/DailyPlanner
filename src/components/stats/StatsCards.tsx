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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* Today's Progress */}
      <div className="bg-white dark:bg-surface rounded-card p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-button bg-primary/10">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs text-dark/60 font-medium">Task Hari Ini</span>
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-heading font-bold text-dark">
            {completedTasks}
          </span>
          <span className="text-sm text-dark/40 mb-0.5">/ {totalTasks}</span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-dark/50">{progress}% selesai</p>
      </div>

      {/* Streak */}
      <div className="bg-white dark:bg-surface rounded-card p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-button bg-priority-low/10">
            <TrendingUp className="w-4 h-4 text-priority-low" />
          </div>
          <span className="text-xs text-dark/60 font-medium">Streak</span>
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-heading font-bold text-dark">{streakDays}</span>
          <span className="text-sm text-dark/40 mb-0.5">hari</span>
        </div>
        <p className="mt-1.5 text-[10px] text-dark/50">
          {streakDays > 0 ? `${streakDays} hari berturut-turut! 🔥` : 'Mulai besok!'}
        </p>
      </div>

      {/* Upcoming */}
      <div className="bg-white dark:bg-surface rounded-card p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-button bg-cat-belajar/10">
            <Clock className="w-4 h-4 text-cat-belajar" />
          </div>
          <span className="text-xs text-dark/60 font-medium">Mendatang</span>
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-heading font-bold text-dark">{totalTasks - completedTasks}</span>
          <span className="text-sm text-dark/40 mb-0.5">task</span>
        </div>
        <p className="mt-1.5 text-[10px] text-dark/50">Belum diselesaikan</p>
      </div>
    </div>
  );
}
