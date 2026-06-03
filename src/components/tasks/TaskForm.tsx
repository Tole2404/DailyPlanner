'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, TaskInsert, Category, Priority, CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/types';
import { format } from 'date-fns';
import clsx from 'clsx';

interface TaskFormProps {
  task?: Task;
  defaultDate?: Date;
  onSubmit: (data: TaskInsert) => void;
  onClose: () => void;
}

const CATEGORIES: Category[] = ['kerja', 'pribadi', 'kesehatan', 'belajar', 'lain'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const STATUSES = ['pending', 'in_progress', 'completed', 'overdue'] as const;

export function TaskForm({ task, defaultDate, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    date: task?.date || (defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')),
    time_start: task?.time_start || '',
    time_end: task?.time_end || '',
    category: task?.category || 'lain',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    reminder: task?.reminder || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Judul task wajib diisi';
    }
    if (!formData.date) {
      newErrors.date = 'Tanggal wajib diisi';
    }
    if (formData.time_start && formData.time_end && formData.time_start > formData.time_end) {
      newErrors.time_end = 'Waktu selesai harus depois waktu mulai';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      date: formData.date,
      time_start: formData.time_start || null,
      time_end: formData.time_end || null,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      reminder: formData.reminder || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal-animate relative bg-white dark:bg-surface rounded-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-surface border-b border-surface p-4 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg">
            {task ? 'Edit Task' : 'Tambah Task Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-dark mb-1.5">
              Judul Task *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Apa yang perlu dilakukan?"
              className={clsx(
                'w-full px-3 py-2.5 rounded-input border bg-white dark:bg-dark/5',
                'text-dark placeholder:text-dark/30 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary/30',
                errors.title ? 'border-priority-high' : 'border-surface'
              )}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-priority-high">{errors.title}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-dark mb-1.5">
              Tanggal *
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={clsx(
                'w-full px-3 py-2.5 rounded-input border bg-white dark:bg-dark/5',
                'text-dark text-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary/30',
                errors.date ? 'border-priority-high' : 'border-surface'
              )}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-priority-high">{errors.date}</p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="time_start" className="block text-sm font-medium text-dark mb-1.5">
                Waktu Mulai
              </label>
              <input
                id="time_start"
                type="time"
                value={formData.time_start}
                onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                className="w-full px-3 py-2.5 rounded-input border border-surface bg-white dark:bg-dark/5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label htmlFor="time_end" className="block text-sm font-medium text-dark mb-1.5">
                Waktu Selesai
              </label>
              <input
                id="time_end"
                type="time"
                value={formData.time_end}
                onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                className="w-full px-3 py-2.5 rounded-input border border-surface bg-white dark:bg-dark/5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          {errors.time_end && (
            <p className="-mt-2 text-xs text-priority-high">{errors.time_end}</p>
          )}

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-dark mb-1.5">
              Kategori
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full px-3 py-2.5 rounded-input border border-surface bg-white dark:bg-dark/5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-dark mb-1.5">
              Prioritas
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={clsx(
                    'flex-1 py-2 rounded-input border text-sm font-medium transition-colors',
                    formData.priority === p
                      ? 'border-transparent text-white'
                      : 'border-surface text-dark/70 hover:border-primary'
                  )}
                  style={{
                    backgroundColor: formData.priority === p ? PRIORITY_LABELS[p].toLowerCase().includes('tinggi') ? '#F87171' : PRIORITY_LABELS[p].toLowerCase().includes('sedang') ? '#FB923C' : '#4ADE80' : undefined,
                  }}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Status (only for edit) */}
          {task && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-dark mb-1.5">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof STATUSES[number] })}
                className="w-full px-3 py-2.5 rounded-input border border-surface bg-white dark:bg-dark/5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-dark mb-1.5">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tambahkan detail task (opsional)"
              rows={3}
              className="w-full px-3 py-2.5 rounded-input border border-surface bg-white dark:bg-dark/5 text-dark placeholder:text-dark/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Reminder */}
          <div>
            <label htmlFor="reminder" className="block text-sm font-medium text-dark mb-1.5">
              Pengingat
            </label>
            <input
              id="reminder"
              type="datetime-local"
              value={formData.reminder}
              onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
              className="w-full px-3 py-2.5 rounded-input border border-surface bg-white dark:bg-dark/5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-button border border-surface text-dark/70 font-medium hover:bg-surface transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-button bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              {task ? 'Simpan' : 'Tambah Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
