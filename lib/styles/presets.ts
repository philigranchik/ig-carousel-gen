import type { StylePreset, StylePresetConfig } from '@/types/carousel';

export const STYLE_PRESETS: StylePresetConfig[] = [
  {
    id: 'pastel',
    name: 'Пастельные',
    description: 'Мягкие нежные цвета',
    colors: ['#FFE5EC', '#E8F4F8', '#FFF3E0', '#E8F5E9', '#F3E5F5'],
    aiPromptHint: 'Используй мягкие пастельные цвета: нежно-розовый (#FFE5EC), светло-голубой (#E8F4F8), персиковый (#FFE5D9), мятный (#E8F5E9), лавандовый (#F3E5F5). Чередуй цвета между слайдами для разнообразия.',
  },
  {
    id: 'dark-professional',
    name: 'Тёмный профессиональный',
    description: 'Строгие тёмные тона',
    colors: ['#1E2328', '#2C3E50', '#1A365D', '#3D3D3D', '#2D3436'],
    aiPromptHint: 'Используй тёмные профессиональные цвета: тёмно-серый (#1E2328), тёмно-синий (#2C3E50), глубокий синий (#1A365D), угольный (#3D3D3D). Эти цвета создают серьёзный деловой вид.',
  },
  {
    id: 'bright-contrast',
    name: 'Яркий контрастный',
    description: 'Насыщенные яркие цвета',
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94'],
    aiPromptHint: 'Используй яркие насыщенные цвета: коралловый (#FF6B6B), бирюзовый (#4ECDC4), солнечно-жёлтый (#FFE66D), мятно-зелёный (#95E1D3), розовый (#FF8B94). Чередуй для динамичного вида.',
  },
  {
    id: 'minimal',
    name: 'Минимализм',
    description: 'Чёрно-белая гамма',
    colors: ['#FFFFFF', '#F5F5F5', '#212121', '#424242', '#E0E0E0'],
    aiPromptHint: 'Используй минималистичную чёрно-белую палитру: белый (#FFFFFF), светло-серый (#F5F5F5), тёмно-серый (#424242), чёрный (#212121). Простота и элегантность.',
  },
  {
    id: 'gradient-modern',
    name: 'Современные градиенты',
    description: 'Модные цветовые переходы',
    colors: ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE'],
    aiPromptHint: 'Используй современные градиентные цвета: фиолетово-синий (#667EEA), пурпурный (#764BA2), розовый (#F093FB), коралловый (#F5576C), голубой (#4FACFE). Каждый слайд - один насыщенный цвет.',
  },
];

export function getStylePreset(id: StylePreset): StylePresetConfig {
  return STYLE_PRESETS.find((preset) => preset.id === id) || STYLE_PRESETS[0];
}

export function getStylePromptHint(id: StylePreset): string {
  const preset = getStylePreset(id);
  return preset.aiPromptHint;
}
