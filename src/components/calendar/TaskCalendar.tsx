'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface TaskCalendarProps {
  tasks: Array<{ id: string; date: string; category: string }>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function TaskCalendar({ tasks, selectedDate, onSelectDate }: TaskCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Create a set of dates with tasks for quick lookup
  const taskDates = useMemo(() => {
    const dates = new Set<string>();
    tasks.forEach((task) => {
      dates.add(task.date);
    });
    return dates;
  }, [tasks]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="bg-white dark:bg-surface rounded-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1.5 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-heading font-semibold text-dark">
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-1.5 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-dark/50 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasTask = taskDates.has(dateStr);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(day)}
              className={clsx(
                'aspect-square rounded-button flex flex-col items-center justify-center gap-0.5 transition-colors relative',
                isSelected
                  ? 'bg-primary text-white'
                  : isToday
                  ? 'bg-surface text-dark font-semibold'
                  : 'text-dark hover:bg-surface/50'
              )}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {hasTask && (
                <span
                  className={clsx(
                    'w-1.5 h-1.5 rounded-full',
                    isSelected ? 'bg-white' : 'bg-primary'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
