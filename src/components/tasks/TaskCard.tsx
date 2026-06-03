'use client';

import { useState } from 'react';
import { Check, Trash2, Edit2, Clock } from 'lucide-react';
import { Task, CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_COLORS, STATUS_LABELS } from '@/lib/types';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);

  const isCompleted = task.status === 'completed';
  const categoryColor = CATEGORY_COLORS[task.category];
  const priorityColor = PRIORITY_COLORS[task.priority];

  const borderColor = isCompleted
    ? 'rgba(0,0,0,0.1)'
    : task.status === 'overdue'
    ? PRIORITY_COLORS.high
    : task.status === 'in_progress'
    ? PRIORITY_COLORS.medium
    : categoryColor;

  return (
    <div
      className={clsx(
        'task-card relative bg-white dark:bg-surface rounded-card p-4 cursor-pointer',
        'transition-all duration-200',
        isCompleted && 'opacity-60'
      )}
      style={{ borderLeft: `4px solid ${borderColor}` }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        {/* Category Badge */}
        <span
          className="inline-flex items-center text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded-badge text-white"
          style={{ backgroundColor: categoryColor }}
        >
          {CATEGORY_LABELS[task.category]}
        </span>

        {/* Priority */}
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: priorityColor }}
            title={`Prioritas ${PRIORITY_LABELS[task.priority]}`}
          />
          {task.status === 'overdue' && (
            <span className="text-[10px] font-medium text-priority-high">Overdue</span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={clsx('font-medium text-dark mb-1', isCompleted && 'task-completed')}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-dark/60 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Time */}
      {task.time_start && (
        <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {task.time_start}
            {task.time_end && ` – ${task.time_end}`}
          </span>
        </div>
      )}

      {/* Actions */}
      <div
        className={clsx(
          'flex items-center gap-2 transition-opacity duration-200',
          showActions ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Complete toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id, !isCompleted);
          }}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-medium transition-colors',
            isCompleted
              ? 'bg-surface text-dark/60 hover:bg-surface/80'
              : 'bg-primary text-white hover:bg-primary/90'
          )}
        >
          <Check className="w-3.5 h-3.5" />
          {isCompleted ? 'Batalkan' : 'Selesai'}
        </button>

        {/* Edit */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="p-1.5 rounded-button text-dark/40 hover:text-primary hover:bg-surface transition-colors"
          aria-label="Edit task"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="p-1.5 rounded-button text-dark/40 hover:text-priority-high hover:bg-surface transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
