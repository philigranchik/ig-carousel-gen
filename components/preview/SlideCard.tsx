'use client';

import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { RefreshCw, Edit2, Check, X } from 'lucide-react';
import type { SlideData } from '@/types/carousel';

// Determine if a color is light or dark based on luminance
function isLightColor(hex: string): boolean {
  if (!hex || !hex.startsWith('#')) return false;
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 140; // Slightly higher threshold for better contrast
}

interface SlideCardProps {
  slide: SlideData;
  index: number;
  isRegenerating?: boolean;
  onRegenerate: (index: number) => void;
  onUpdate: (index: number, data: Partial<SlideData>) => void;
}

export const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  index,
  isRegenerating = false,
  onRegenerate,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(slide.title);
  const [editedContent, setEditedContent] = useState(slide.content);

  // Determine text color based on background brightness
  const isLight = useMemo(() => isLightColor(slide.backgroundColor || ''), [slide.backgroundColor]);
  const textColorClass = isLight ? 'text-gray-800' : 'text-white';
  const textSecondaryClass = isLight ? 'text-gray-600' : 'text-white/70';
  const badgeClass = isLight ? 'bg-black/10 text-gray-800 border-black/10' : 'bg-white/10 text-white border-white/10';
  const inputBgClass = isLight ? 'bg-black/10 text-gray-800 border-black/10 focus:border-indigo-500/50' : 'bg-white/10 text-white border-white/10 focus:border-indigo-500/50';

  const handleSave = () => {
    onUpdate(index, { title: editedTitle, content: editedContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(slide.title);
    setEditedContent(slide.content);
    setIsEditing(false);
  };

  return (
    <div
      className={clsx(
        'slide-preview group',
        isRegenerating && 'opacity-50'
      )}
      style={{
        background: slide.backgroundColor
          ? slide.backgroundColor
          : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      {/* Slide number badge */}
      <div className={clsx(
        "absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center text-sm font-semibold border",
        badgeClass
      )}>
        {slide.order}
      </div>

      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all border border-white/10"
              title="Редактировать"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onRegenerate(index)}
              disabled={isRegenerating}
              className="p-2 bg-indigo-500/50 backdrop-blur-sm rounded-lg text-white hover:bg-indigo-500/70 transition-all border border-indigo-400/30 disabled:opacity-50"
              title="Перегенерировать"
            >
              <RefreshCw
                className={clsx('w-3.5 h-3.5', isRegenerating && 'animate-spin')}
              />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="p-2 bg-green-500/50 backdrop-blur-sm rounded-lg text-white hover:bg-green-500/70 transition-all border border-green-400/30"
              title="Сохранить"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-red-500/50 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/70 transition-all border border-red-400/30"
              title="Отменить"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
        {slide.emoji && !isEditing && (
          <span className="text-3xl mb-2">{slide.emoji}</span>
        )}

        {isEditing ? (
          <div className="w-full space-y-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className={clsx(
                "w-full backdrop-blur-sm text-sm font-bold rounded-lg px-3 py-2 text-center border focus:outline-none",
                inputBgClass
              )}
              placeholder="Заголовок"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={clsx(
                "w-full backdrop-blur-sm text-xs rounded-lg px-3 py-2 text-center resize-none border focus:outline-none",
                inputBgClass
              )}
              rows={3}
              placeholder="Контент"
            />
          </div>
        ) : (
          <>
            <h3 className={clsx("text-base font-bold mb-1.5 leading-tight line-clamp-2", textColorClass)}>
              {slide.title}
            </h3>
            <p className={clsx("text-xs leading-relaxed line-clamp-3", textSecondaryClass)}>
              {slide.content}
            </p>
          </>
        )}
      </div>

      {/* Accent line */}
      <div className={clsx(
        "absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full",
        isLight ? "bg-indigo-600/50" : "bg-indigo-400/50"
      )} />
    </div>
  );
};
