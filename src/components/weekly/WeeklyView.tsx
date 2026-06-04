'use client';

import { useState, useMemo } from 'react';
import { Task } from '@/lib/types';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface WeeklyViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onDateClick?: (date: Date) => void;
}

export function WeeklyView({ tasks, onTaskClick, onDateClick }: WeeklyViewProps) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    weekDays.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      grouped[dateStr] = tasks
        .filter((t) => t.date === dateStr)
        .sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''));
    });
    return grouped;
  }, [tasks, weekDays]);

  const goToPrevWeek = () => setWeekStart((prev) => addDays(prev, -7));
  const goToNextWeek = () => setWeekStart((prev) => addDays(prev, 7));
  const goToToday = () => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="bg-white dark:bg-surface rounded-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-lg text-dark">
            Minggu Ini
          </h2>
          <p className="text-sm text-dark/60">
            {format(weekStart, 'd MMM', { locale: id })} -{' '}
            {format(weekDays[6], 'd MMM yyyy', { locale: id })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium rounded-button bg-surface text-dark hover:bg-dark/10 transition-colors"
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={goToPrevWeek}
            className="p-1.5 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
            aria-label="Minggu Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goToNextWeek}
            className="p-1.5 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
            aria-label="Minggu Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate[dateStr] || [];
          const completedCount = dayTasks.filter((t) => t.status === 'completed').length;
          const todayFlag = isToday(day);

          return (
            <div
              key={dateStr}
              className={clsx(
                'min-h-[180px] rounded-card border-2 transition-all',
                todayFlag
                  ? 'border-primary bg-primary/5'
                  : 'border-surface bg-white dark:bg-dark/20'
              )}
            >
              {/* Day Header */}
              <button
                type="button"
                onClick={() => onDateClick?.(day)}
                className={clsx(
                  'w-full p-2 text-center border-b-2 transition-colors',
                  todayFlag
                    ? 'border-primary bg-primary text-white'
                    : 'border-surface hover:bg-surface'
                )}
              >
                <div className="text-xs font-medium uppercase">
                  {format(day, 'EEE', { locale: id })}
                </div>
                <div className={clsx('text-xl font-heading font-bold', todayFlag ? 'text-white' : 'text-dark')}>
                  {format(day, 'd')}
                </div>
              </button>

              {/* Tasks */}
              <div className="p-1.5 space-y-1.5 max-h-[140px] overflow-y-auto">
                {dayTasks.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-dark/30">Tidak ada task</p>
                  </div>
                ) : (
                  <>
                    {dayTasks.slice(0, 3).map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => onTaskClick?.(task)}
                        className={clsx(
                          'w-full text-left p-1.5 rounded text-xs transition-all hover:scale-[1.02]',
                          task.status === 'completed'
                            ? 'bg-priority-low/20 text-dark/50 line-through'
                            : 'bg-primary/10 text-dark hover:bg-primary/20'
                        )}
                      >
                        <div className="font-semibold truncate">{task.title}</div>
                        {task.time_start && (
                          <div className="text-[10px] text-dark/60 mt-0.5">
                            {task.time_start}
                          </div>
                        )}
                      </button>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-center py-1">
                        <span className="text-[10px] text-dark/50 font-medium">
                          +{dayTasks.length - 3} lainnya
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer Stats */}
              {dayTasks.length > 0 && (
                <div className="px-2 py-1 border-t border-surface">
                  <div className="text-[10px] text-dark/60 text-center">
                    {completedCount}/{dayTasks.length} selesai
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
