'use client';

import { useState } from 'react';
import { taskTemplates, TaskTemplate } from '@/lib/taskTemplates';
import { TaskInsert } from '@/lib/types';
import { X, Check } from 'lucide-react';
import clsx from 'clsx';

interface TemplatesPickerProps {
  selectedDate: Date;
  onApply: (tasks: Omit<TaskInsert, 'user_id'>[]) => void;
  onClose: () => void;
}

export function TemplatesPicker({ selectedDate, onApply, onClose }: TemplatesPickerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [customizing, setCustomizing] = useState(false);

  const handleApply = () => {
    if (!selectedTemplate) return;

    const tasksWithDate = selectedTemplate.tasks.map((task) => ({
      ...task,
      date: selectedDate.toISOString().split('T')[0],
    }));

    onApply(tasksWithDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface rounded-card w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface">
          <div>
            <h2 className="font-heading font-semibold text-xl text-dark">
              Pilih Template
            </h2>
            <p className="text-sm text-dark/60 mt-1">
              Gunakan template untuk menambahkan task lebih cepat
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-dark/60 hover:text-dark hover:bg-surface transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Grid */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskTemplates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template)}
                  className={clsx(
                    'text-left p-4 rounded-card border-2 transition-all hover:scale-[1.02]',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-surface hover:border-primary/30'
                  )}
                >
                  {/* Template Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{template.icon}</div>
                      <div>
                        <h3 className="font-heading font-semibold text-dark">
                          {template.name}
                        </h3>
                        <p className="text-xs text-dark/50 capitalize">
                          {template.category}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="p-1 rounded-full bg-primary text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Task Preview */}
                  <div className="space-y-1.5">
                    {template.tasks.slice(0, 3).map((task, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-2 rounded bg-surface/50 text-dark/70"
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        {task.time_start && (
                          <div className="text-[10px] text-dark/50 mt-0.5">
                            {task.time_start} - {task.time_end}
                          </div>
                        )}
                      </div>
                    ))}
                    {template.tasks.length > 3 && (
                      <div className="text-[10px] text-dark/40 text-center py-1">
                        +{template.tasks.length - 3} task lainnya
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-surface">
          <div className="text-sm text-dark/60">
            {selectedTemplate
              ? `${selectedTemplate.tasks.length} task akan ditambahkan`
              : 'Pilih template untuk melihat detail'}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-button text-dark/60 hover:bg-surface transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedTemplate}
              className={clsx(
                'px-4 py-2 rounded-button font-medium transition-all',
                selectedTemplate
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-surface text-dark/30 cursor-not-allowed'
              )}
            >
              Gunakan Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
