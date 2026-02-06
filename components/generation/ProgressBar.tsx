'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import type { GenerationStep } from '@/types/carousel';

interface ProgressBarProps {
  step: GenerationStep;
  progress: number;
  message: string;
}

const STEPS: { key: GenerationStep; label: string }[] = [
  { key: 'input', label: 'Данные' },
  { key: 'analyzing', label: 'Анализ' },
  { key: 'structure_preview', label: 'Сценарий' },
  { key: 'generating_visuals', label: 'Визуалы' },
  { key: 'preview', label: 'Готово' },
];

export const ProgressBar: React.FC<ProgressBarProps> = ({
  step,
  progress,
  message,
}) => {
  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-6">
        {STEPS.map((s, index) => (
          <React.Fragment key={s.key}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'step-indicator',
                  index < currentStepIndex && 'completed',
                  index === currentStepIndex && 'active',
                  index > currentStepIndex && 'pending'
                )}
              >
                {index < currentStepIndex ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={clsx(
                  'text-xs mt-2 hidden sm:block',
                  index <= currentStepIndex ? 'text-white/70' : 'text-white/30'
                )}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div className="flex-1 mx-2 h-0.5 rounded-full bg-white/10 relative overflow-hidden">
                <div
                  className={clsx(
                    'absolute inset-y-0 left-0 accent-gradient transition-all duration-500',
                    index < currentStepIndex && 'w-full',
                    index === currentStepIndex && 'w-1/2',
                    index > currentStepIndex && 'w-0'
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
