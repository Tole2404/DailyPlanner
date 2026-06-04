'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { Bell, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { requestNotificationPermission, getUpcomingTasks } from '@/lib/notifications';

interface NotificationPanelProps {
  tasks: Task[];
  onClose: () => void;
}

export function NotificationPanel({ tasks, onClose }: NotificationPanelProps) {
  const [permStatus, setPermStatus] = useState<NotificationPermission>('default');
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    if ('Notification' in window) {
      setPermStatus(Notification.permission);
    }
    setUpcomingTasks(getUpcomingTasks(tasks));
  }, [tasks]);

  const handleEnableNotifications = async () => {
    const status = await requestNotificationPermission();
    setPermStatus(status);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 md:w-96 z-50">
      <div className="bg-white dark:bg-surface rounded-card shadow-2xl border border-surface overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold text-dark">Notifikasi</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Permission Request */}
          {permStatus !== 'granted' && (
            <div className="mb-4 p-3 rounded-button bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">Aktifkan Notifikasi</p>
                  <p className="text-xs text-dark/60 mt-1">
                    Dapatkan pengingat otomatis 15 menit sebelum task dimulai
                  </p>
                  <button
                    type="button"
                    onClick={handleEnableNotifications}
                    className="mt-2 px-3 py-1.5 text-xs font-medium rounded-button bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    {permStatus === 'denied' ? 'Blokir - Buka Pengaturan Browser' : 'Aktifkan'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          <div>
            <h4 className="text-xs font-semibold text-dark/50 uppercase tracking-wider mb-3">
              Task Hari Ini
            </h4>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-priority-low" />
                <p className="text-sm text-dark/60">Semua task sudah selesai!</p>
                <p className="text-xs text-dark/40">Tidak ada task upcoming lagi hari ini</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-button bg-surface/50 hover:bg-surface transition-colors"
                  >
                    <div className={clsx(
                      'w-2 h-2 rounded-full mt-1.5 shrink-0',
                      task.priority === 'high' ? 'bg-priority-high' :
                      task.priority === 'medium' ? 'bg-priority-medium' :
                      'bg-priority-low'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark truncate">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {task.time_start && (
                          <span className="flex items-center gap-1 text-xs text-dark/50">
                            <Clock className="w-3 h-3" />
                            {task.time_start}
                          </span>
                        )}
                        <span className="text-xs capitalize text-dark/50 px-1.5 py-0.5 rounded bg-surface">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {permStatus === 'granted' && (
          <div className="px-4 py-3 border-t border-surface bg-surface/30">
            <p className="text-xs text-dark/40 text-center">
              ✅ Notifikasi aktif — kamu akan diingatkan 15 menit sebelum task
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
