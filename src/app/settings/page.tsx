'use client';

import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Sidebar, Header, BottomNav } from '@/components/layout';
import { ExportImportModal } from '@/components/export';
import { getLocalTasks, saveLocalTasks } from '@/lib/localTasks';
import { Task } from '@/lib/types';
import { Moon, Sun, Monitor, User, Download } from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showExportImport, setShowExportImport] = useState(false);

  const handleImport = (importedTasks: Task[]) => {
    const existingTasks = getLocalTasks();
    const mergedTasks = [...existingTasks, ...importedTasks];
    saveLocalTasks(mergedTasks);
  };

  const themeOptions = [
    { value: 'light', label: 'Terang', icon: Sun },
    { value: 'dark', label: 'Gelap', icon: Moon },
    { value: 'system', label: 'Sistem', icon: Monitor },
  ] as const;

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />

      <div className="md:ml-[260px] min-h-screen pb-20 md:pb-0">
        <Header />

        <main className="p-4 md:p-6">
          <div className="max-w-2xl">
            {/* Profile */}
            <div className="bg-white dark:bg-surface rounded-card p-5 mb-6">
              <h3 className="font-heading font-semibold mb-4">Profil</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-dark">Pengguna Lokal</p>
                  <p className="text-sm text-dark/60">Data tersimpan di perangkat ini</p>
                </div>
              </div>
            </div>

            {/* Theme */}
            <div className="bg-white dark:bg-surface rounded-card p-5 mb-6">
              <h3 className="font-heading font-semibold mb-4">Tema</h3>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-4 rounded-card border transition-colors',
                      theme === value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-surface text-dark/70 hover:border-primary/50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Export & Import */}
            <div className="bg-white dark:bg-surface rounded-card p-5 mb-6">
              <h3 className="font-heading font-semibold mb-4">Backup & Restore</h3>
              <button
                type="button"
                onClick={() => setShowExportImport(true)}
                className="w-full flex items-center justify-between p-4 rounded-card border-2 border-surface hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-dark">Export & Import Data</div>
                    <div className="text-sm text-dark/60">Backup atau restore task kamu</div>
                  </div>
                </div>
              </button>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-surface rounded-card p-5 mb-6">
              <h3 className="font-heading font-semibold mb-4">Tentang</h3>
              <div className="space-y-2 text-sm text-dark/70">
                <p><span className="font-medium text-dark">DayFlow</span> v1.0.0</p>
                <p>Plan your day, own your life</p>
                <p className="text-xs text-dark/40">
                  Progressive Web App untuk produktivitas harian
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNav />

      {showExportImport && (
        <ExportImportModal
          tasks={getLocalTasks()}
          onImport={handleImport}
          onClose={() => setShowExportImport(false)}
        />
      )}
    </div>
  );
}
