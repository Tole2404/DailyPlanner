import { Task } from './types';

export interface ExportData {
  version: string;
  exportDate: string;
  tasks: Task[];
  metadata: {
    totalTasks: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

export function exportTasksToJSON(tasks: Task[]): string {
  const sortedTasks = [...tasks].sort((a, b) => a.date.localeCompare(b.date));
  
  const dates = sortedTasks.map((t) => t.date);
  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    tasks: sortedTasks,
    metadata: {
      totalTasks: tasks.length,
      dateRange: {
        start: dates[0] || '',
        end: dates[dates.length - 1] || '',
      },
    },
  };

  return JSON.stringify(exportData, null, 2);
}

export function exportTasksToCSV(tasks: Task[]): string {
  const headers = [
    'ID',
    'Tanggal',
    'Waktu Mulai',
    'Waktu Selesai',
    'Judul',
    'Deskripsi',
    'Kategori',
    'Prioritas',
    'Status',
    'Dibuat',
  ];

  const rows = tasks.map((task) => [
    task.id,
    task.date,
    task.time_start || '',
    task.time_end || '',
    `"${task.title.replace(/"/g, '""')}"`,
    `"${(task.description || '').replace(/"/g, '""')}"`,
    task.category,
    task.priority,
    task.status,
    task.created_at,
  ]);

  return [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importTasksFromJSON(file: File): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as ExportData;
        
        if (!data.tasks || !Array.isArray(data.tasks)) {
          throw new Error('Format file tidak valid');
        }

        resolve(data.tasks);
      } catch (error) {
        reject(new Error('Gagal membaca file: ' + (error as Error).message));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsText(file);
  });
}

export function validateImportedTasks(tasks: Task[]): { valid: Task[]; errors: string[] } {
  const valid: Task[] = [];
  const errors: string[] = [];

  tasks.forEach((task, index) => {
    if (!task.id || !task.title || !task.date) {
      errors.push(`Baris ${index + 1}: Data task tidak lengkap`);
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(task.date)) {
      errors.push(`Baris ${index + 1}: Format tanggal tidak valid`);
      return;
    }

    valid.push(task);
  });

  return { valid, errors };
}
