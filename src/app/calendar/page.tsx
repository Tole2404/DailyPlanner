'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskInsert } from '@/lib/types';
import { addLocalTask, deleteLocalTask, getLocalTasks, updateLocalTask } from '@/lib/localTasks';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { TaskCard, TaskForm } from '@/components/tasks';
import { Sidebar, Header, BottomNav } from '@/components/layout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const startDate = format(monthStart, 'yyyy-MM-dd');
    const endDate = format(monthEnd, 'yyyy-MM-dd');

    const data = getLocalTasks()
      .filter((task) => task.date >= startDate && task.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time_start || '').localeCompare(b.time_start || ''));

    setTasks(data);
    setIsLoading(false);
  }, [monthStart, monthEnd]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedDayTasks = selectedDateStr ? tasksByDate[selectedDateStr] || [] : [];

  const goToPrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const goToNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const handleAddTask = async (data: Omit<TaskInsert, 'user_id'>) => {
    addLocalTask(data);
    setShowForm(false);
    fetchTasks();
  };

  const handleUpdateTask = async (data: Omit<TaskInsert, 'user_id'>) => {
    if (!editingTask) return;
    updateLocalTask(editingTask.id, data);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Apus task ini?')) return;
    deleteLocalTask(id);
    fetchTasks();
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    updateLocalTask(id, { status: completed ? 'completed' : 'pending' });
    fetchTasks();
  };

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />

      <div className="md:ml-[260px] min-h-screen pb-20 md:pb-0">
        <Header />

        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-surface rounded-card p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={goToPrevMonth}
                    className="p-1.5 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-heading font-semibold text-xl">
                    {format(currentMonth, 'MMMM yyyy', { locale: id })}
                  </h2>
                  <button
                    onClick={goToNextMonth}
                    className="p-1.5 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
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

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayTasks = tasksByDate[dateStr] || [];
                    const hasTask = dayTasks.length > 0;
                    const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateStr;
                    const completedCount = dayTasks.filter(t => t.status === 'completed').length;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          aspect-square rounded-button flex flex-col items-center justify-center gap-0.5 transition-colors relative
                          ${isSelected ? 'bg-primary text-white' : isToday ? 'bg-surface text-dark' : 'text-dark hover:bg-surface/50'}
                        `}
                      >
                        <span className="text-sm">{format(day, 'd')}</span>
                        {hasTask && (
                          <span className={`text-[9px] ${isSelected ? 'text-white/80' : 'text-dark/50'}`}>
                            {completedCount}/{dayTasks.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected day's tasks */}
            <div className="lg:col-span-1">
              {selectedDate ? (
                <div className="bg-white dark:bg-surface rounded-card p-5">
                  <h3 className="font-heading font-semibold mb-4">
                    {format(selectedDate, 'EEEE, d MMMM', { locale: id })}
                  </h3>

                  {selectedDayTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-dark/50 mb-3">Tidak ada task</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 rounded-button bg-primary text-white text-sm font-medium"
                      >
                        + Tambah Task
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDayTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onEdit={(t) => setEditingTask(t)}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-surface rounded-card p-5 text-center">
                  <p className="text-sm text-dark/50">
                    Klik tanggal untuk melihat task
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <BottomNav onAddTask={() => setShowForm(true)} />

      {showForm && (
        <TaskForm
          defaultDate={selectedDate || new Date()}
          onSubmit={handleAddTask}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
