'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskInsert } from '@/lib/types';
import { addLocalTask, deleteLocalTask, getLocalTasks, updateLocalTask } from '@/lib/localTasks';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { TaskCard, TaskForm } from '@/components/tasks';
import { TaskCalendar } from '@/components/calendar';
import { StatsCards } from '@/components/stats';
import { Sidebar, Header, BottomNav } from '@/components/layout';
import { TemplatesPicker } from '@/components/templates/TemplatesPicker';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { Plus, Inbox, Sparkles, Timer } from 'lucide-react';

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [activePomodoroTask, setActivePomodoroTask] = useState<Task | null>(null);


  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const data = getLocalTasks()
      .filter((task) => task.date === dateStr)
      .sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''));

    setTasks(data);
    setIsLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Get stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    streak: 1, // TODO: implement streak calculation
  };

  // Task handlers
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
    if (!confirm('Yakin hapus task ini?')) return;

    deleteLocalTask(id);
    fetchTasks();
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    updateLocalTask(id, { status: completed ? 'completed' : 'pending' });
    fetchTasks();
  };

  const handleApplyTemplate = (tasks: Omit<TaskInsert, 'user_id'>[]) => {
    tasks.forEach((task) => {
      addLocalTask(task);
    });
    fetchTasks();
  };

  const handleStartPomodoro = (task: Task) => {
    setActivePomodoroTask(task);
    setShowPomodoro(true);
  };

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />

      <div className="md:ml-[260px] min-h-screen pb-20 md:pb-0">
        <Header />

        <main className="p-3 md:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-3">
              {/* Stats summary */}
              <StatsCards
                totalTasks={stats.total}
                completedTasks={stats.completed}
                streakDays={stats.streak}
              />

              {/* Tasks list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-semibold text-lg">
                    Task {format(selectedDate, 'EEEE, d MMMM', { locale: id })}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-button bg-surface text-dark text-sm font-medium hover:bg-surface/70 transition-colors"
                      title="Gunakan Template"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden md:inline">Template</span>
                    </button>
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-button bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden md:inline">Tambah Task</span>
                    </button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-6 text-dark/50 text-sm">Memuat...</div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-6">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-dark/20" />
                    <h3 className="font-medium text-dark text-sm mb-1">Belum ada task hari ini</h3>
                    <p className="text-xs text-dark/50 mb-3">
                      Mulai rencanakan harimu! 🌤️
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-4 py-2 rounded-button bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      + Tambah Task Pertama
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
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
            </div>

            {/* Calendar sidebar */}
            <div className="lg:col-span-1 space-y-2">
              {/* Pomodoro Timer */}
              <div className="bg-white dark:bg-surface rounded-card p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-xs text-dark flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-primary" />
                    Pomodoro
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowPomodoro(!showPomodoro)}
                    className="text-[10px] font-medium text-primary hover:text-primary/80"
                  >
                    {showPomodoro ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                {showPomodoro && (
                  <div className="mt-2">
                    <PomodoroTimer
                      taskId={activePomodoroTask?.id}
                      taskTitle={activePomodoroTask?.title}
                    />
                  </div>
                )}
              </div>

              <TaskCalendar
                tasks={tasks.map(t => ({ id: t.id, date: t.date, category: t.category }))}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
          </div>
        </main>
      </div>

      <BottomNav onAddTask={() => setShowForm(true)} />

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          defaultDate={selectedDate}
          onSubmit={handleAddTask}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Templates Picker Modal */}
      {showTemplates && (
        <TemplatesPicker
          selectedDate={selectedDate}
          onApply={handleApplyTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}
