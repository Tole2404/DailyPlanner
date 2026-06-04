'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types';
import { getLocalTasks } from '@/lib/localTasks';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { Sidebar, Header, BottomNav } from '@/components/layout';
import { StatsCards } from '@/components/stats';
import { WeeklyView } from '@/components/weekly/WeeklyView';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{
    total: number;
    completed: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
  }>({
    total: 0,
    completed: 0,
    byCategory: {},
    byPriority: {},
  });

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const data = getLocalTasks()
      .filter((task) => task.date >= format(monthStart, 'yyyy-MM-dd') && task.date <= format(monthEnd, 'yyyy-MM-dd'))
      .sort((a, b) => a.date.localeCompare(b.date));

    setTasks(data);

      // Calculate stats
      const total = data.length;
      const completed = data.filter(t => t.status === 'completed').length;
      const byCategory: Record<string, number> = {};
      const byPriority: Record<string, number> = {};

      data.forEach((task: Task) => {
        byCategory[task.category] = (byCategory[task.category] || 0) + 1;
        byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
      });

      setMonthlyData({ total, completed, byCategory, byPriority });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const streakDays = 1; // TODO: calculate actual streak

  // Donut chart data for category distribution
  const categoryData = Object.entries(monthlyData.byCategory).map(([cat, count]) => ({
    name: CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat,
    value: count,
    color: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] || '#94A3B8',
  }));

  const totalCategoryTasks = categoryData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />

      <div className="md:ml-[260px] min-h-screen pb-20 md:pb-0">
        <Header />

        <main className="p-4 md:p-6">
          <h2 className="font-heading font-semibold text-xl mb-6">Statistik Bulanan</h2>

          {/* Stats */}
          <StatsCards
            totalTasks={monthlyData.total}
            completedTasks={monthlyData.completed}
            streakDays={streakDays}
          />

          {/* Weekly View */}
          <div className="mt-6">
            <WeeklyView
              tasks={getLocalTasks()}
              onTaskClick={(task) => {
                // Navigate to today page with selected task
                window.location.href = `/today?date=${task.date}`;
              }}
              onDateClick={(date) => {
                window.location.href = `/today?date=${format(date, 'yyyy-MM-dd')}`;
              }}
            />
          </div>

          {/* Category Distribution */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-surface rounded-card p-5">
              <h3 className="font-heading font-semibold mb-4">Distribusi Kategori</h3>
              {categoryData.length === 0 ? (
                <p className="text-sm text-dark/50 text-center py-8">Belum ada data</p>
              ) : (
                <div className="space-y-3">
                  {categoryData.map(({ name, value, color }) => {
                    const percentage = totalCategoryTasks > 0 ? Math.round((value / totalCategoryTasks) * 100) : 0;
                    return (
                      <div key={name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-sm text-dark">{name}</span>
                          </div>
                          <span className="text-sm text-dark/60">{value} task</span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Priority Distribution */}
            <div className="bg-white dark:bg-surface rounded-card p-5">
              <h3 className="font-heading font-semibold mb-4">Distribusi Prioritas</h3>
              <div className="grid grid-cols-3 gap-4">
                {['high', 'medium', 'low'].map((priority) => {
                  const count = monthlyData.byPriority[priority] || 0;
                  const colors: Record<string, string> = {
                    high: '#F87171',
                    medium: '#FB923C',
                    low: '#4ADE80',
                  };
                  const labels: Record<string, string> = {
                    high: 'Tinggi',
                    medium: 'Sedang',
                    low: 'Rendah',
                  };
                  return (
                    <div key={priority} className="text-center">
                      <div
                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: colors[priority] + '20' }}
                      >
                        <span
                          className="text-2xl font-bold"
                          style={{ color: colors[priority] }}
                        >
                          {count}
                        </span>
                      </div>
                      <span className="text-sm text-dark/70">{labels[priority]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="mt-6 bg-white dark:bg-surface rounded-card p-5">
            <h3 className="font-heading font-semibold mb-4">Task Terbaru</h3>
            {tasks.length === 0 ? (
              <p className="text-sm text-dark/50 text-center py-8">Belum ada task bulan ini</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface">
                      <th className="text-left py-2 px-2 text-dark/60 font-medium">Task</th>
                      <th className="text-left py-2 px-2 text-dark/60 font-medium">Tanggal</th>
                      <th className="text-left py-2 px-2 text-dark/60 font-medium">Kategori</th>
                      <th className="text-left py-2 px-2 text-dark/60 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 10).map((task) => (
                      <tr key={task.id} className="border-b border-surface/50">
                        <td className="py-2 px-2 text-dark">{task.title}</td>
                        <td className="py-2 px-2 text-dark/60">{format(new Date(task.date), 'd MMM')}</td>
                        <td className="py-2 px-2">
                          <span
                            className="px-2 py-0.5 rounded-badge text-white text-xs"
                            style={{ backgroundColor: CATEGORY_COLORS[task.category] }}
                          >
                            {CATEGORY_LABELS[task.category]}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded-badge text-white text-xs ${
                            task.status === 'completed' ? 'bg-priority-low' :
                            task.status === 'overdue' ? 'bg-priority-high' :
                            task.status === 'in_progress' ? 'bg-primary' : 'bg-dark/30'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
