'use client';

import { useState } from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { usePathname } from 'next/navigation';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { getLocalTasks } from '@/lib/localTasks';
import clsx from 'clsx';

const pageTitles: Record<string, string> = {
  '/today': 'Hari Ini',
  '/calendar': 'Kalender',
  '/dashboard': 'Statistik',
  '/settings': 'Pengaturan',
};

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const title = pageTitles[pathname] || 'DayFlow';

  const tasks = getLocalTasks();

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-bg/85 backdrop-blur-xl dark:bg-slate-950/65 dark:border-white/10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Page Title */}
        <div>
          <h2 className="font-heading font-semibold text-lg md:text-xl text-dark">
            {title}
          </h2>
          <p className="text-xs text-dark/50 hidden md:block">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Right side actions */}
        <div className="relative flex items-center gap-2">
          {/* Bell / Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={clsx(
                'p-2 rounded-button transition-colors relative',
                showNotifications
                  ? 'text-primary bg-primary/10'
                  : 'text-dark/60 hover:text-dark hover:bg-surface'
              )}
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {/* Dot indicator if upcoming tasks */}
              {tasks.some(
                (t) =>
                  t.date === new Date().toISOString().split('T')[0] &&
                  t.status !== 'completed' &&
                  t.time_start
              ) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-priority-high" />
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="relative z-50">
                  <NotificationPanel
                    tasks={tasks}
                    onClose={() => setShowNotifications(false)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-full shadow-sm transition-all',
              'bg-primary text-white hover:scale-105 hover:bg-primary/90'
            )}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            <span className="hidden sm:inline text-xs font-semibold">
              {resolvedTheme === 'light' ? 'Gelap' : 'Terang'}
            </span>
          </button>

          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center md:hidden">
            <span className="text-xs font-semibold text-primary">U</span>
          </div>
        </div>
      </div>
    </header>
  );
}
