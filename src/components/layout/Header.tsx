'use client';

import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { usePathname } from 'next/navigation';
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
  const title = pageTitles[pathname] || 'DayFlow';

  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-surface">
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
            className={clsx(
              'p-2 rounded-button transition-colors',
              'text-dark/60 hover:text-dark hover:bg-surface',
              'md:hidden'
            )}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <button
            className={clsx(
              'p-2 rounded-button transition-colors',
              'text-dark/60 hover:text-dark hover:bg-surface'
            )}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center md:hidden">
            <span className="text-xs font-semibold text-primary">U</span>
          </div>
        </div>
      </div>
    </header>
  );
}
