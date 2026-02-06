'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import type { GeneratedSlide } from '@/types/carousel';

interface FinalPreviewProps {
  carouselId: string;
  slides: GeneratedSlide[];
  onStartOver: () => void;
}

export const FinalPreview: React.FC<FinalPreviewProps> = ({
  carouselId,
  slides,
  onStartOver,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const downloadSingle = async (slide: GeneratedSlide) => {
    const response = await fetch(slide.imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slide-${slide.order}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    setDownloadingAll(true);
    try {
      for (const slide of slides) {
        await downloadSingle(slide);
        await new Promise((r) => setTimeout(r, 300));
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 animate-pulse-glow">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-3">
          Карусель готова!
        </h2>
        <p className="text-white/60">
          {slides.length} слайдов сгенерировано и готово к скачиванию
        </p>
      </div>

      {/* Main preview */}
      <div className="glass-card p-6 md:p-8 mb-8">
        <div className="relative">
          {/* Main slide */}
          <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden glow">
            <Image
              src={slides[currentIndex].imageUrl}
              alt={`Слайд ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 p-3 glass-card-light rounded-full text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 p-3 glass-card-light rounded-full text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-indigo-500 w-6'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Slide info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/40 mb-1">
            Слайд {currentIndex + 1} из {slides.length}
          </p>
          <p className="text-white font-medium">{slides[currentIndex].title}</p>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-thin">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
              index === currentIndex
                ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0f0f1a]'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-md">
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={downloadAll}
          disabled={downloadingAll}
          className="btn-primary flex items-center justify-center gap-2 px-8"
        >
          {downloadingAll ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Скачиваем...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Скачать все слайды
            </>
          )}
        </button>

        <button
          onClick={() => downloadSingle(slides[currentIndex])}
          className="btn-secondary flex items-center justify-center gap-2 px-8"
        >
          <Download className="w-5 h-5" />
          Скачать текущий
        </button>
      </div>

      {/* Start over */}
      <div className="mt-12 text-center">
        <button
          onClick={onStartOver}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Создать новую карусель
        </button>
      </div>
    </div>
  );
};
