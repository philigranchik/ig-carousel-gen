'use client';

import React, { useState, useEffect } from 'react';

interface LoadingStateProps {
  message: string;
  progress: number;
  estimatedSeconds?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  progress,
  estimatedSeconds = 30,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Reset timer when message changes (new step)
  useEffect(() => {
    setElapsedSeconds(0);
  }, [message]);

  const remainingSeconds = Math.max(0, estimatedSeconds - elapsedSeconds);
  const isOvertime = elapsedSeconds > estimatedSeconds;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}с`;
  };

  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-card mb-6">
        <svg
          className="w-10 h-10 text-white/50 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

      <p className="text-xl text-white/70 mb-2">{message}</p>

      {/* Timer */}
      <div className="text-sm text-white/40 mb-6">
        {isOvertime ? (
          <span className="text-yellow-400/70">
            Занимает больше времени... {formatTime(elapsedSeconds)}
          </span>
        ) : (
          <span>
            ~{formatTime(remainingSeconds)} осталось
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 mx-auto rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-white/30 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Cancel hint */}
      {elapsedSeconds > 60 && (
        <p className="mt-6 text-xs text-white/30">
          Если загрузка зависла, обновите страницу
        </p>
      )}
    </div>
  );
};
