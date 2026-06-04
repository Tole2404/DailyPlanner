'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import clsx from 'clsx';

type PomodoroPhase = 'work' | 'break' | 'long-break';

interface PomodoroTimerProps {
  taskId?: string;
  taskTitle?: string;
  onComplete?: (phase: PomodoroPhase, duration: number) => void;
}

const DURATIONS = {
  work: 25 * 60, // 25 minutes
  break: 5 * 60, // 5 minutes
  'long-break': 15 * 60, // 15 minutes
};

export function PomodoroTimer({ taskId, taskTitle, onComplete }: PomodoroTimerProps) {
  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const totalTime = DURATIONS[phase];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[phase]);
  };

  const handlePhaseChange = (newPhase: PomodoroPhase) => {
    setPhase(newPhase);
    setTimeLeft(DURATIONS[newPhase]);
    setIsRunning(false);
  };

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    
    if (phase === 'work') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      // Long break after 4 pomodoros
      const nextPhase = newCount % 4 === 0 ? 'long-break' : 'break';
      setPhase(nextPhase);
      setTimeLeft(DURATIONS[nextPhase]);

      onComplete?.(phase, DURATIONS.work);
    } else {
      // Break complete, back to work
      setPhase('work');
      setTimeLeft(DURATIONS.work);
      onComplete?.(phase, DURATIONS[phase]);
    }
  }, [phase, completedPomodoros, onComplete]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleComplete]);

  const phaseConfig = {
    work: {
      label: 'Fokus Kerja',
      icon: Target,
      color: 'bg-primary',
      textColor: 'text-primary',
      ringColor: 'ring-primary',
    },
    break: {
      label: 'Istirahat Pendek',
      icon: Coffee,
      color: 'bg-priority-low',
      textColor: 'text-priority-low',
      ringColor: 'ring-priority-low',
    },
    'long-break': {
      label: 'Istirahat Panjang',
      icon: Coffee,
      color: 'bg-priority-medium',
      textColor: 'text-priority-medium',
      ringColor: 'ring-priority-medium',
    },
  };

  const config = phaseConfig[phase];
  const Icon = config.icon;

  return (
    <div className="bg-white dark:bg-surface rounded-card p-6 space-y-6">
      {/* Task Info */}
      {taskTitle && (
        <div className="text-center">
          <p className="text-sm text-dark/60 mb-1">Task Aktif:</p>
          <h3 className="font-heading font-semibold text-dark">{taskTitle}</h3>
        </div>
      )}

      {/* Phase Tabs */}
      <div className="flex gap-2 p-1 bg-surface rounded-button">
        {(Object.keys(DURATIONS) as PomodoroPhase[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePhaseChange(p)}
            disabled={isRunning}
            className={clsx(
              'flex-1 py-2 px-3 rounded-button text-xs font-semibold transition-all',
              phase === p
                ? `${phaseConfig[p].color} text-white`
                : 'text-dark/50 hover:bg-white dark:hover:bg-dark/20',
              isRunning && phase !== p && 'opacity-40 cursor-not-allowed'
            )}
          >
            {phaseConfig[p].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div className="flex items-center justify-center">
          <div
            className={clsx(
              'relative w-56 h-56 rounded-full flex items-center justify-center ring-8',
              config.ringColor
            )}
            style={{
              background: `conic-gradient(
                ${config.color.replace('bg-', 'var(--color-')}${config.color === 'bg-primary' ? ')' : ''} ${progress}%, 
                transparent ${progress}%
              )`,
            }}
          >
            <div className="absolute inset-2 bg-white dark:bg-surface rounded-full flex flex-col items-center justify-center gap-2">
              <Icon className={clsx('w-8 h-8', config.textColor)} />
              <div className="text-5xl font-heading font-bold text-dark">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-dark/50">
                {completedPomodoros} pomodoro selesai
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="p-3 rounded-full bg-surface text-dark/60 hover:bg-dark/10 hover:text-dark transition-all"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={isRunning ? handlePause : handleStart}
          className={clsx(
            'p-6 rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95',
            config.color
          )}
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>

        <div className="w-14" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface">
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-dark">
            {completedPomodoros}
          </div>
          <div className="text-xs text-dark/50">Pomodoro</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-dark">
            {Math.floor((completedPomodoros * 25) / 60)}h
          </div>
          <div className="text-xs text-dark/50">Total Fokus</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-dark">
            {Math.ceil(completedPomodoros / 4)}
          </div>
          <div className="text-xs text-dark/50">Sesi</div>
        </div>
      </div>
    </div>
  );
}
