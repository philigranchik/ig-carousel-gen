'use client';

import React from 'react';
import type { StylePresetConfig } from '@/types/carousel';

interface StylePresetPreviewProps {
  preset: StylePresetConfig;
  isSelected: boolean;
  onClick: () => void;
}

// Функция для определения светлого/тёмного цвета
function isLightColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  const rgb = parseInt(cleanHex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 128;
}

export const StylePresetPreview: React.FC<StylePresetPreviewProps> = ({
  preset,
  isSelected,
  onClick,
}) => {
  const bgColor = preset.colors[0];
  const accentColor = preset.colors[preset.colors.length - 1];
  const textColor = isLightColor(bgColor) ? '#2c3e50' : '#ffffff';

  return (
    <button
      type="button"
      className={`style-preset-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {/* Превью слайда */}
      <div
        className="aspect-square rounded-lg overflow-hidden mb-2 border border-white/10 relative"
        style={{ backgroundColor: bgColor }}
      >
        {/* Декоративные круги */}
        <div
          className="absolute top-6 left-8 w-10 h-10 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
        />
        <div
          className="absolute top-12 right-8 w-16 h-16 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
        />
        <div
          className="absolute bottom-8 left-6 w-12 h-12 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
        />

        {/* Номер слайда */}
        <div
          className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: textColor
          }}
        >
          1
        </div>

        {/* Контент слайда */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {/* Emoji */}
          <div className="text-2xl mb-2">✨</div>

          {/* Заголовок */}
          <div
            className="text-sm font-bold text-center mb-1"
            style={{ color: textColor }}
          >
            Заголовок
          </div>

          {/* Текст */}
          <div
            className="text-xs text-center opacity-85"
            style={{ color: textColor }}
          >
            Пример текста<br/>в этом стиле
          </div>
        </div>

        {/* Акцентная линия */}
        <div
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 h-0.5 w-8"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Название и описание */}
      <div className="text-white/90 text-sm font-medium">{preset.name}</div>
      <div className="text-white/40 text-xs mt-0.5">{preset.description}</div>

      {/* Цветовая палитра */}
      <div className="flex gap-0.5 mt-2 justify-center">
        {preset.colors.slice(0, 5).map((color, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full border border-white/20"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </button>
  );
};
