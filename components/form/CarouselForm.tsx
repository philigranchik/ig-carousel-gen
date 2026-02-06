'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carouselFormSchema, type CarouselFormInput } from '@/lib/validation/schemas';
import { Upload, Zap, Sparkles, Cpu, ArrowRight, Palette } from 'lucide-react';
import { STYLE_PRESETS } from '@/lib/styles/presets';
import type { StylePreset } from '@/types/carousel';
import { StylePresetPreview } from './StylePresetPreview';

interface CarouselFormProps {
  onSubmit: (data: CarouselFormInput) => Promise<void>;
  isLoading?: boolean;
}

export const CarouselForm: React.FC<CarouselFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('template');
  const [selectedSlideCount, setSelectedSlideCount] = useState(5);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>('pastel');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CarouselFormInput>({
    resolver: zodResolver(carouselFormSchema),
    defaultValues: {
      slideCount: 5,
      businessTheme: '',
      leadMagnet: '',
      codeWord: '',
      visualMethod: 'template',
      stylePreset: 'pastel',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceFile(file);
      setValue('reference', file);
    }
  };

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    setValue('visualMethod', method as 'template' | 'ai' | 'comfyui');
  };

  const handleSlideCountChange = (count: number) => {
    setSelectedSlideCount(count);
    setValue('slideCount', count);
  };

  const handleStyleChange = (style: StylePreset) => {
    setSelectedStyle(style);
    setValue('stylePreset', style);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-6 md:p-8">
        {/* Заголовок формы */}
        <div className="mb-8 pb-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Создание карусели</h2>
          <p className="text-sm text-white/40 mt-1">Заполните параметры для генерации</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Количество слайдов */}
          <div className="form-section">
            <span className="form-section-label">Количество слайдов</span>
            <div className="slide-chips">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`slide-chip ${selectedSlideCount === count ? 'selected' : ''}`}
                  onClick={() => handleSlideCountChange(count)}
                >
                  {count}
                </button>
              ))}
            </div>
            <input type="hidden" {...register('slideCount', { valueAsNumber: true })} />
            {errors.slideCount?.message && (
              <p className="mt-3 text-sm text-red-400">{errors.slideCount.message}</p>
            )}
          </div>

          {/* Тема бизнеса */}
          <div className="form-section">
            <span className="form-section-label">Тема бизнеса</span>
            <textarea
              className="input-glass min-h-[100px] resize-none"
              placeholder="Например: Онлайн школа по инвестициям для начинающих"
              {...register('businessTheme')}
            />
            <p className="mt-3 text-xs text-white/35">Опишите ваш бизнес или нишу (5-200 символов)</p>
            {errors.businessTheme?.message && (
              <p className="mt-2 text-sm text-red-400">{errors.businessTheme.message}</p>
            )}
          </div>

          {/* Лид-магнит */}
          <div className="form-section">
            <span className="form-section-label">Лид-магнит</span>
            <textarea
              className="input-glass min-h-[100px] resize-none"
              placeholder="Например: Бесплатный гайд 'Первые 10,000₽ на инвестициях'"
              {...register('leadMagnet')}
            />
            <p className="mt-3 text-xs text-white/35">Что вы предлагаете в конце карусели? (5-300 символов)</p>
            {errors.leadMagnet?.message && (
              <p className="mt-2 text-sm text-red-400">{errors.leadMagnet.message}</p>
            )}
          </div>

          {/* Кодовое слово */}
          <div className="form-section">
            <span className="form-section-label">Кодовое слово</span>
            <input
              type="text"
              className="input-glass"
              placeholder="Например: ГАЙД или БИЗНЕС2025"
              {...register('codeWord')}
            />
            <p className="mt-3 text-xs text-white/35">
              Слово, которое аудитория напишет в директ для получения лид-магнита
            </p>
            {errors.codeWord?.message && (
              <p className="mt-2 text-sm text-red-400">{errors.codeWord.message}</p>
            )}
          </div>

          {/* Референс */}
          <div className="form-section">
            <span className="form-section-label">Референс (необязательно)</span>
            <div className="upload-zone">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="reference-upload"
              />
              <label htmlFor="reference-upload" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-white/25 mx-auto mb-3" />
                {referenceFile ? (
                  <div>
                    <p className="text-white/60 text-sm">{referenceFile.name}</p>
                    <p className="text-xs text-white/30 mt-1">Нажмите, чтобы заменить</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white/40 text-sm">Загрузите пример карусели</p>
                    <p className="text-xs text-white/25 mt-1">JPG, PNG, WEBP до 5MB</p>
                  </div>
                )}
              </label>
            </div>
            {errors.reference?.message && (
              <p className="mt-3 text-sm text-red-400">{errors.reference.message}</p>
            )}
          </div>

          {/* Стиль оформления */}
          <div className="form-section">
            <span className="form-section-label flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Стиль оформления
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STYLE_PRESETS.map((preset) => (
                <StylePresetPreview
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedStyle === preset.id}
                  onClick={() => handleStyleChange(preset.id)}
                />
              ))}
            </div>
            <input type="hidden" {...register('stylePreset')} />
          </div>

          {/* Метод генерации */}
          <div className="form-section">
            <span className="form-section-label">Метод генерации визуалов</span>
            <div className="space-y-3">
              <label
                className={`radio-card flex items-start gap-4 ${selectedMethod === 'template' ? 'selected' : ''}`}
                onClick={() => handleMethodChange('template')}
              >
                <input
                  type="radio"
                  value="template"
                  {...register('visualMethod')}
                  className="hidden"
                />
                <div className="method-icon template">
                  <Zap className="w-5 h-5 text-white/70" />
                </div>
                <div className="flex-1">
                  <div className="text-white/90 font-medium flex items-center gap-2">
                    Шаблоны
                    <span className="badge badge-recommended">Рекомендуем</span>
                  </div>
                  <p className="text-sm text-white/40 mt-1">
                    Мгновенно, бесплатно, профессиональный результат
                  </p>
                </div>
              </label>

              <label
                className={`radio-card flex items-start gap-4 ${selectedMethod === 'ai' ? 'selected' : ''}`}
                onClick={() => handleMethodChange('ai')}
              >
                <input
                  type="radio"
                  value="ai"
                  {...register('visualMethod')}
                  className="hidden"
                />
                <div className="method-icon ai">
                  <Sparkles className="w-5 h-5 text-purple-400/80" />
                </div>
                <div className="flex-1">
                  <div className="text-white/90 font-medium">AI генерация</div>
                  <p className="text-sm text-white/40 mt-1">
                    Уникальные изображения, ~20₽ за карусель
                  </p>
                </div>
              </label>

              <label className="radio-card flex items-start gap-4 opacity-40 cursor-not-allowed">
                <input
                  type="radio"
                  value="comfyui"
                  disabled
                  className="hidden"
                />
                <div className="method-icon comfyui">
                  <Cpu className="w-5 h-5 text-white/30" />
                </div>
                <div className="flex-1">
                  <div className="text-white/40 font-medium flex items-center gap-2">
                    ComfyUI
                    <span className="badge badge-soon">Скоро</span>
                  </div>
                  <p className="text-sm text-white/25 mt-1">
                    Локальная генерация на вашем GPU
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Кнопка отправки */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base"
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
                  Создать карусель
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Информация */}
            <p className="text-center text-xs text-white/25 mt-4">
              {isLoading
                ? 'AI анализирует рынок и создаёт контент...'
                : 'Генерация занимает 20-40 секунд'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
