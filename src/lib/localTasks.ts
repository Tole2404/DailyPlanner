import { Task, TaskInsert } from './types';

const STORAGE_KEY = 'dayflow_tasks';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function createLocalId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getLocalTasks(): Task[] {
  if (!canUseStorage()) return [];

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]') as Task[];
  } catch {
    return [];
  }
}

export function saveLocalTasks(tasks: Task[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addLocalTask(data: Omit<TaskInsert, 'user_id'>): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: createLocalId(),
    user_id: 'local-user',
    title: data.title,
    description: data.description ?? null,
    date: data.date,
    time_start: data.time_start ?? null,
    time_end: data.time_end ?? null,
    category: data.category ?? 'lain',
    priority: data.priority ?? 'medium',
    status: data.status ?? 'pending',
    reminder: data.reminder ?? null,
    created_at: now,
    updated_at: now,
  };

  const tasks = getLocalTasks();
  saveLocalTasks([task, ...tasks]);
  return task;
}

export function updateLocalTask(id: string, data: Partial<Omit<TaskInsert, 'user_id'>>) {
  const tasks = getLocalTasks().map((task) =>
    task.id === id ? { ...task, ...data, updated_at: new Date().toISOString() } : task
  );
  saveLocalTasks(tasks);
}

export function deleteLocalTask(id: string) {
  saveLocalTasks(getLocalTasks().filter((task) => task.id !== id));
}
