'use client';

import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { CarouselForm } from '@/components/form/CarouselForm';
import { ProgressBar } from '@/components/generation/ProgressBar';
import { LoadingState } from '@/components/generation/LoadingState';
import { StructurePreview } from '@/components/preview/StructurePreview';
import { FinalPreview } from '@/components/preview/FinalPreview';
import { useCarouselStore } from '@/lib/store/carousel-store';
import type { CarouselFormInput } from '@/lib/validation/schemas';
import type { VisualMethod } from '@/types/carousel';
import { Sparkles } from 'lucide-react';

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 60000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export default function Home() {
  const {
    step,
    setStep,
    progress,
    setProgress,
    isLoading,
    setLoading,
    error,
    setError,
    formData,
    setFormData,
    marketAnalysis,
    setMarketAnalysis,
    setReferenceAnalysis,
    structure,
    setStructure,
    updateSlide,
    generatedSlides,
    setGeneratedSlides,
    reset,
  } = useCarouselStore();

  const [carouselId, setCarouselId] = useState<string | null>(null);

  const handleFormSubmit = async (data: CarouselFormInput) => {
    setFormData(data);
    setLoading(true);
    setError(null);
    setStep('analyzing');
    setProgress({ progress: 10, message: 'Анализируем рынок...' });

    try {
      const analyzeFormData = new FormData();
      analyzeFormData.append('businessTheme', data.businessTheme);
      if (data.reference) {
        analyzeFormData.append('reference', data.reference);
      }

      const analyzeRes = await fetchWithTimeout('/api/analyze', {
        method: 'POST',
        body: analyzeFormData,
      }, 90000);

      if (!analyzeRes.ok) {
        const errorData = await analyzeRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка при анализе рынка');
      }

      const analyzeData = await analyzeRes.json();
      setMarketAnalysis(analyzeData.marketAnalysis);
      if (analyzeData.referenceAnalysis) {
        setReferenceAnalysis(analyzeData.referenceAnalysis);
      }

      setProgress({ progress: 50, message: 'Создаём сценарий карусели...' });

      const structureRes = await fetchWithTimeout('/api/generate/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideCount: data.slideCount,
          businessTheme: data.businessTheme,
          leadMagnet: data.leadMagnet,
          codeWord: data.codeWord,
          marketAnalysis: analyzeData.marketAnalysis,
          referenceAnalysis: analyzeData.referenceAnalysis,
          stylePreset: data.stylePreset,
        }),
      }, 90000);

      if (!structureRes.ok) {
        const errorData = await structureRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка при генерации структуры');
      }

      const structureData = await structureRes.json();
      setStructure(structureData.structure);

      setProgress({ progress: 100, message: 'Готово!' });
      setStep('structure_preview');
      setLoading(false);
      toast.success('Сценарий карусели готов!');
    } catch (err) {
      console.error(err);
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const message = isAbort
        ? 'Превышено время ожидания. Попробуйте еще раз.'
        : err instanceof Error
        ? err.message
        : 'Произошла ошибка';
      setError(message);
      setStep('input');
      setLoading(false);
      toast.error(isAbort ? 'Timeout - попробуйте еще раз' : 'Ошибка при генерации');
    }
  };

  const handleRegenerateSlide = async (index: number) => {
    if (!structure) return;

    try {
      const res = await fetch('/api/generate/regenerate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideIndex: index,
          currentSlide: structure.slides[index],
          context: {
            topic: structure.topic,
            targetAudience: structure.targetAudience,
          },
        }),
      });

      if (!res.ok) throw new Error('Ошибка при перегенерации');

      const data = await res.json();
      updateSlide(index, data.slide);
      toast.success(`Слайд ${index + 1} перегенерирован`);
    } catch {
      toast.error('Не удалось перегенерировать слайд');
    }
  };

  const handleGenerateVisuals = async () => {
    if (!structure) return;

    const visualMethod: VisualMethod = formData?.visualMethod || 'template';
    const isAiGeneration = visualMethod === 'ai';

    setLoading(true);
    setStep('generating_visuals');
    setProgress({
      progress: 0,
      message: isAiGeneration
        ? 'Генерируем AI-фоны (это займёт больше времени)...'
        : 'Генерируем изображения...',
    });

    try {
      // AI generation needs more time (polling for each slide)
      const timeout = isAiGeneration ? 300000 : 120000;

      const res = await fetchWithTimeout('/api/generate/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: structure.slides,
          visualMethod,
          topic: structure.topic,
        }),
      }, timeout);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка при генерации изображений');
      }

      const data = await res.json();
      setCarouselId(data.carouselId);
      setGeneratedSlides(data.slides);

      setProgress({ progress: 100, message: 'Готово!' });
      setStep('preview');
      setLoading(false);
      toast.success('Карусель готова!');
    } catch (err) {
      console.error(err);
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const message = isAbort
        ? 'Превышено время ожидания. Попробуйте еще раз.'
        : err instanceof Error
        ? err.message
        : 'Произошла ошибка';
      setError(message);
      setStep('structure_preview');
      setLoading(false);
      toast.error(isAbort ? 'Timeout - попробуйте еще раз' : 'Ошибка при генерации изображений');
    }
  };

  const handleBackToForm = () => {
    setStep('input');
    setError(null);
  };

  const handleStartOver = () => {
    reset();
    setCarouselId(null);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      />

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 py-12 px-4">
        {/* Header */}
        <header className="max-w-4xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-light mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-white/70">AI-Powered Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 tracking-tight">
            Instagram Carousel Generator
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Создайте вирусную карусель для Instagram с помощью искусственного интеллекта за пару минут
          </p>
        </header>

        {/* Progress bar */}
        {step !== 'input' && step !== 'preview' && (
          <ProgressBar
            step={step}
            progress={progress.progress}
            message={progress.message}
          />
        )}

        {/* Error display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 glass-card border-red-500/30 text-red-300">
            {error}
          </div>
        )}

        {/* Main content */}
        <main className="max-w-6xl mx-auto">
          {step === 'input' && (
            <CarouselForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          )}

          {(step === 'analyzing' || step === 'structure') && (
            <LoadingState
              message={progress.message}
              progress={progress.progress}
              estimatedSeconds={progress.progress < 50 ? 20 : 15}
            />
          )}

          {step === 'structure_preview' && structure && marketAnalysis && (
            <StructurePreview
              structure={structure}
              marketAnalysis={marketAnalysis}
              onUpdateSlide={updateSlide}
              onRegenerateSlide={handleRegenerateSlide}
              onBack={handleBackToForm}
              onContinue={handleGenerateVisuals}
              isLoading={isLoading}
            />
          )}

          {step === 'generating_visuals' && (
            <LoadingState
              message={progress.message}
              progress={progress.progress}
              estimatedSeconds={30}
            />
          )}

          {step === 'preview' && carouselId && generatedSlides.length > 0 && (
            <FinalPreview
              carouselId={carouselId}
              slides={generatedSlides}
              onStartOver={handleStartOver}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/30">
            Powered by OpenAI GPT-4 · Made with love
          </p>
        </footer>
      </div>
    </div>
  );
}
