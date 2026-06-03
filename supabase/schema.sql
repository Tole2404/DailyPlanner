-- ============================================
-- DayFlow Database Schema (Supabase SQL)
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Tasks table
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  date date not null default current_date,
  time_start time,
  time_end time,
  category text not null default 'lain' check (category in ('kerja', 'pribadi', 'kesehatan', 'belajar', 'lain')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'overdue')),
  reminder timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User profiles table
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_date_idx on public.tasks(date);
create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists tasks_category_idx on public.tasks(category);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for tasks updated_at
create or replace trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.handle_updated_at();

-- Trigger for user_profiles updated_at
create or replace trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

-- Function to create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on auth.users insert
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on tasks
alter table public.tasks enable row level security;

-- Enable RLS on user_profiles
alter table public.user_profiles enable row level security;

-- Tasks policies
create policy "Users can view own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- User profiles policies
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- ============================================
-- ADDITIONAL HELPERS
-- ============================================

-- Function to get tasks by date
create or replace function public.get_tasks_by_date(target_date date)
returns setof public.tasks as $$
begin
  return query
  select * from public.tasks
  where date = target_date and auth.uid() = user_id
  order by time_start asc nulls last;
end;
$$ language plpgsql security definer;

-- Function to get today's task count
create or replace function public.get_today_stats()
returns json as $$
declare
  today_tasks_count int;
  completed_tasks_count int;
  streak_count int;
begin
  select count(*) into today_tasks_count
  from public.tasks
  where date = current_date and auth.uid() = user_id;

  select count(*) into completed_tasks_count
  from public.tasks
  where date = current_date
    and status = 'completed'
    and auth.uid() = user_id;

  -- Simple streak: consecutive days with at least 1 completed task
  select count(*) into streak_count
  from (
    select date, count(*) as completed
    from public.tasks
    where auth.uid() = user_id and status = 'completed'
    group by date
    having count(*) > 0
    order by date desc
    limit 30
  ) sub;

  return json_build_object(
    'total', today_tasks_count,
    'completed', completed_tasks_count,
    'streak', streak_count
  );
end;
$$ language plpgsql security definer;
