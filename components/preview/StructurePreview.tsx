'use client';

import React, { useState } from 'react';
import { SlideCard } from './SlideCard';
import { ArrowLeft, ArrowRight, Sparkles, Target, Eye, EyeOff } from 'lucide-react';
import type { CarouselStructure, SlideData } from '@/types/carousel';

interface StructurePreviewProps {
  structure: CarouselStructure;
  marketAnalysis: string;
  onUpdateSlide: (index: number, data: Partial<SlideData>) => void;
  onRegenerateSlide: (index: number) => Promise<void>;
  onBack: () => void;
  onContinue: () => void;
  isLoading?: boolean;
}

export const StructurePreview: React.FC<StructurePreviewProps> = ({
  structure,
  marketAnalysis,
  onUpdateSlide,
  onRegenerateSlide,
  onBack,
  onContinue,
  isLoading = false,
}) => {
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleRegenerate = async (index: number) => {
    setRegeneratingIndex(index);
    try {
      await onRegenerateSlide(index);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              Сценарий карусели
            </h2>
            <p className="text-white/70">
              Тема: <span className="text-white font-medium">{structure.topic}</span>
            </p>
            <div className="flex items-center gap-2 mt-2 text-white/50 text-sm">
              <Target className="w-4 h-4" />
              <span>{structure.targetAudience}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          <span className="px-3 py-1.5 rounded-full glass-card-light text-sm text-white/70">
            {structure.slides.length} слайдов
          </span>
          <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">
            {structure.hook.slice(0, 40)}...
          </span>
        </div>

        {/* Analysis toggle */}
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="mt-6 flex items-center gap-2 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
        >
          {showAnalysis ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAnalysis ? 'Скрыть анализ рынка' : 'Показать анализ рынка'}
        </button>

        {showAnalysis && (
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 whitespace-pre-wrap">
            {marketAnalysis}
          </div>
        )}
      </div>

      {/* Slides grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {structure.slides.map((slide, index) => (
          <SlideCard
            key={index}
            slide={slide}
            index={index}
            isRegenerating={regeneratingIndex === index}
            onRegenerate={handleRegenerate}
            onUpdate={onUpdateSlide}
          />
        ))}
      </div>

      {/* CTA preview */}
      <div className="glass-card p-6 mb-8">
        <p className="text-sm text-white/50 mb-2">Призыв к действию:</p>
        <p className="text-lg text-white font-medium">{structure.cta}</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>

        <button
          onClick={onContinue}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Генерируем...
            </>
          ) : (
            <>
              Генерировать визуалы
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
