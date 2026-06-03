'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Task, TaskInsert } from '@/lib/types';

export function useTasks() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (date?: string) => {
    setIsLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from('tasks')
      .select('*')
      .order('time_start', { ascending: true });

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setTasks((data as Task[]) || []);
    }

    setIsLoading(false);
  };

  const createTask = async (taskData: TaskInsert) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...taskData, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setTasks((prev) => [...prev, data as Task]);
    }

    return { error };
  };

  const updateTask = async (id: string, updates: Partial<TaskInsert>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? (data as Task) : t))
      );
    }

    return { error };
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (!error) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }

    return { error };
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    return updateTask(id, { status: completed ? 'completed' : 'pending' });
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
}
