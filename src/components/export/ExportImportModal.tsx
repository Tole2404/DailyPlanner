'use client';

import { useState, useRef } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet, X, AlertCircle, CheckCircle } from 'lucide-react';
import { exportTasksToJSON, exportTasksToCSV, downloadFile, importTasksFromJSON, validateImportedTasks } from '@/lib/exportImport';
import { Task } from '@/lib/types';
import clsx from 'clsx';

interface ExportImportModalProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
  onClose: () => void;
}

export function ExportImportModal({ tasks, onImport, onClose }: ExportImportModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const json = exportTasksToJSON(tasks);
    const filename = `dayflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(json, filename, 'application/json');
  };

  const handleExportCSV = () => {
    const csv = exportTasksToCSV(tasks);
    const filename = `dayflow-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csv, filename, 'text/csv');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('idle');
      setImportMessage('Memproses file...');

      const importedTasks = await importTasksFromJSON(file);
      const { valid, errors } = validateImportedTasks(importedTasks);

      if (errors.length > 0) {
        setImportStatus('error');
        setImportMessage(`Ditemukan ${errors.length} error:\n${errors.slice(0, 3).join('\n')}`);
        return;
      }

      onImport(valid);
      setImportStatus('success');
      setImportMessage(`Berhasil import ${valid.length} task!`);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setImportStatus('error');
      setImportMessage((error as Error).message);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface rounded-card w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface">
          <h2 className="font-heading font-semibold text-xl text-dark">
            Export & Import Data
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={clsx(
              'flex-1 py-3 px-4 font-medium text-sm transition-colors',
              activeTab === 'export'
                ? 'text-primary border-b-2 border-primary'
                : 'text-dark/50 hover:text-dark'
            )}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={clsx(
              'flex-1 py-3 px-4 font-medium text-sm transition-colors',
              activeTab === 'import'
                ? 'text-primary border-b-2 border-primary'
                : 'text-dark/50 hover:text-dark'
            )}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Import
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-sm text-dark/60">
                Export semua task ke file untuk backup atau migrasi ke device lain.
              </p>

              <div className="space-y-3">
                {/* JSON Export */}
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-4 p-4 rounded-card border-2 border-surface hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="p-3 rounded-button bg-primary/10">
                    <FileJson className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark">Export ke JSON</h3>
                    <p className="text-sm text-dark/60">
                      Format lengkap dengan metadata ({tasks.length} task)
                    </p>
                  </div>
                </button>

                {/* CSV Export */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-4 p-4 rounded-card border-2 border-surface hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="p-3 rounded-button bg-priority-low/10">
                    <FileSpreadsheet className="w-6 h-6 text-priority-low" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark">Export ke CSV</h3>
                    <p className="text-sm text-dark/60">
                      Untuk Excel atau Google Sheets
                    </p>
                  </div>
                </button>
              </div>

              <div className="p-3 rounded-button bg-surface/50">
                <p className="text-xs text-dark/60">
                  💡 <strong>Tip:</strong> Export secara berkala untuk backup data kamu
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-dark/60">
                Import task dari file backup JSON. Data yang sudah ada tidak akan ditimpa.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleImportClick}
                className="w-full flex items-center justify-center gap-3 p-6 rounded-card border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Upload className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <div className="font-semibold text-dark">Pilih file JSON</div>
                  <div className="text-sm text-dark/60">Klik untuk upload</div>
                </div>
              </button>

              {/* Import Status */}
              {importStatus !== 'idle' && (
                <div
                  className={clsx(
                    'p-4 rounded-button flex items-start gap-3',
                    importStatus === 'success' ? 'bg-priority-low/10' : 'bg-priority-high/10'
                  )}
                >
                  {importStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-priority-low shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-priority-high shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={clsx(
                        'text-sm font-medium',
                        importStatus === 'success' ? 'text-priority-low' : 'text-priority-high'
                      )}
                    >
                      {importStatus === 'success' ? 'Berhasil!' : 'Error'}
                    </p>
                    <p className="text-xs text-dark/70 mt-1 whitespace-pre-line">
                      {importMessage}
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-button bg-surface/50">
                <p className="text-xs text-dark/60">
                  ⚠️ <strong>Perhatian:</strong> Hanya file JSON dari DayFlow yang bisa diimport
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
