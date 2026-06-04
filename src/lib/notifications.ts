import { Task } from './types';

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.resolve('denied');
  }
  return Notification.requestPermission();
}

export function sendTaskNotification(task: Task, minutesBefore: number = 15) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const timeText = task.time_start ? `Pukul ${task.time_start}` : '';
  const body = timeText
    ? `${task.title} — ${timeText} (${minutesBefore} menit lagi)`
    : `${task.title}`;

  try {
    new Notification('DayFlow - Pengingat Task', {
      body,
      icon: '/icon-192.png',
      badge: '/favicon.ico',
      tag: task.id,
      requireInteraction: true,
    });
  } catch {
    // Fallback untuk browser yang tidak support
  }
}

export function checkUpcomingTasks(tasks: Task[]): Task[] {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const today = now.toISOString().split('T')[0];

  return tasks.filter((task) => {
    if (task.date !== today || task.status === 'completed') return false;
    if (!task.time_start) return false;

    const [h, m] = task.time_start.split(':').map(Number);
    const taskMinutes = h * 60 + m;
    const diff = taskMinutes - currentMinutes;

    return diff > 0 && diff <= 15;
  });
}

export function getUpcomingTasks(tasks: Task[]): Task[] {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const today = now.toISOString().split('T')[0];

  const upcoming = tasks.filter((task) => {
    if (task.date !== today || task.status === 'completed') return false;
    if (!task.time_start) return false;

    const [h, m] = task.time_start.split(':').map(Number);
    const taskMinutes = h * 60 + m;

    return taskMinutes > currentMinutes;
  });

  return upcoming.sort(
    (a, b) => (a.time_start || '').localeCompare(b.time_start || '')
  );
}
