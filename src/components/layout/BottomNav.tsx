'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Plus, BarChart3, Settings } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/today', label: 'Hari Ini', icon: LayoutDashboard },
  { href: '/calendar', label: 'Kalender', icon: CalendarDays },
  { href: '/dashboard', label: 'Statistik', icon: BarChart3 },
  { href: '/settings', label: 'Setting', icon: Settings },
];

interface BottomNavProps {
  onAddTask?: () => void;
}

export function BottomNav({ onAddTask }: BottomNavProps) {
  const pathname = usePathname();

  const goToPage = (href: string) => {
    if (pathname === href || pathname.startsWith(`${href}/`)) return;

    document.documentElement.classList.add('page-reloading');
    window.setTimeout(() => {
      window.location.href = href;
    }, 140);
  };

  const renderNavButton = ({ href, label, icon: Icon }: (typeof navItems)[number]) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <button
        key={href}
        type="button"
        onClick={() => goToPage(href)}
        className={clsx(
          'flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition-all duration-200 active:scale-95',
          isActive
            ? 'bg-primary text-white shadow-[0_10px_22px_rgba(63,114,175,0.28)]'
            : 'text-dark/55 hover:bg-primary/10 hover:text-primary dark:text-white/55 dark:hover:text-white'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="truncate leading-none">{label}</span>
      </button>
    );
  };

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-white/40 bg-white/92 px-3 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_38px_rgba(17,45,78,0.16)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/92">
      <div className="grid h-[68px] grid-cols-5 items-center gap-1">
        {navItems.slice(0, 2).map(renderNavButton)}

        <button
          type="button"
          onClick={onAddTask ?? (() => goToPage('/today'))}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_14px_30px_rgba(63,114,175,0.42)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          aria-label={onAddTask ? 'Tambah Task' : 'Ke Hari Ini'}
        >
          <Plus className="h-7 w-7" />
        </button>

        {navItems.slice(2).map(renderNavButton)}
      </div>
    </nav>
  );
}
