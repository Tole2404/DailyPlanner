'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import clsx from 'clsx';

const navItems = [
  { href: '/today', label: 'Hari Ini', icon: LayoutDashboard },
  { href: '/calendar', label: 'Kalender', icon: CalendarDays },
  { href: '/dashboard', label: 'Statistik', icon: BarChart3 },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen bg-dark text-white sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <Link href="/today" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl">DayFlow</h1>
            <p className="text-xs text-white/60">Plan your day, own your life</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-button transition-all duration-200',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-button text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'light' ? (
            <>
              <Moon className="w-5 h-5" />
              <span className="font-medium">Mode Gelap</span>
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              <span className="font-medium">Mode Terang</span>
            </>
          )}
        </button>
      </div>

      {/* User Avatar */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User</p>
            <p className="text-xs text-white/50 truncate">user@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
