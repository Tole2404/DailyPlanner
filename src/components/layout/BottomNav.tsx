'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Plus, BarChart3, Settings } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/today', label: 'Hari Ini', icon: LayoutDashboard },
  { href: '/calendar', label: 'Kalender', icon: CalendarDays },
  { href: '/dashboard', label: 'Statistik', icon: BarChart3 },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

interface BottomNavProps {
  onAddTask?: () => void;
}

export function BottomNav({ onAddTask }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark border-t border-surface">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-button transition-colors min-w-[56px]',
                isActive
                  ? 'text-primary'
                  : 'text-dark/50 hover:text-dark'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        {/* FAB for adding task */}
        <button
          onClick={onAddTask}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-button text-primary min-w-[56px]"
          aria-label="Tambah Task"
        >
          <div className="w-10 h-10 -mt-4 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-medium">Tambah</span>
        </button>
      </div>
    </nav>
  );
}
