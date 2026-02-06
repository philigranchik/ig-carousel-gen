// Шаблоны для генерации слайдов
export interface SlideTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  gradientColors?: [string, string];
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

export const SLIDE_TEMPLATES: SlideTemplate[] = [
  // ========== ПРОФЕССИОНАЛЬНЫЕ ТЕМНЫЕ ==========
  {
    id: 'professional-dark',
    name: 'Профессиональный тёмный',
    backgroundColor: '#1e2328',
    gradientColors: ['#2d3436', '#1e2328'],
    textColor: '#ffffff',
    accentColor: '#74b9ff',
    fontFamily: 'Inter',
  },
  {
    id: 'elegant-navy',
    name: 'Элегантный синий',
    backgroundColor: '#2c3e50',
    gradientColors: ['#34495e', '#2c3e50'],
    textColor: '#ffffff',
    accentColor: '#ecf0f1',
    fontFamily: 'Inter',
  },
  {
    id: 'soft-slate',
    name: 'Мягкий сланец',
    backgroundColor: '#4a5568',
    gradientColors: ['#718096', '#4a5568'],
    textColor: '#ffffff',
    accentColor: '#e2e8f0',
    fontFamily: 'Inter',
  },
  {
    id: 'warm-charcoal',
    name: 'Тёплый уголь',
    backgroundColor: '#3d3d3d',
    gradientColors: ['#4a4a4a', '#3d3d3d'],
    textColor: '#ffffff',
    accentColor: '#f5b041',
    fontFamily: 'Inter',
  },
  {
    id: 'deep-ocean',
    name: 'Глубокий океан',
    backgroundColor: '#1a365d',
    gradientColors: ['#2a4365', '#1a365d'],
    textColor: '#ffffff',
    accentColor: '#90cdf4',
    fontFamily: 'Inter',
  },

  // ========== ПРОФЕССИОНАЛЬНЫЕ СВЕТЛЫЕ ==========
  {
    id: 'clean-white',
    name: 'Чистый белый',
    backgroundColor: '#ffffff',
    gradientColors: ['#f7fafc', '#ffffff'],
    textColor: '#1a202c',
    accentColor: '#4299e1',
    fontFamily: 'Inter',
  },
  {
    id: 'soft-cream',
    name: 'Мягкий крем',
    backgroundColor: '#faf5f0',
    gradientColors: ['#f5ebe0', '#faf5f0'],
    textColor: '#3d3d3d',
    accentColor: '#d4a373',
    fontFamily: 'Inter',
  },
  {
    id: 'light-gray',
    name: 'Светло-серый',
    backgroundColor: '#edf2f7',
    gradientColors: ['#e2e8f0', '#edf2f7'],
    textColor: '#2d3748',
    accentColor: '#667eea',
    fontFamily: 'Inter',
  },

  // ========== НЕОНОВЫЕ И CYBERPUNK ==========
  {
    id: 'neon-purple',
    name: 'Неоновый фиолетовый',
    backgroundColor: '#1a0933',
    gradientColors: ['#2d1b4e', '#1a0933'],
    textColor: '#ffffff',
    accentColor: '#bf00ff',
    fontFamily: 'Inter',
  },
  {
    id: 'cyberpunk-pink',
    name: 'Киберпанк розовый',
    backgroundColor: '#0d0221',
    gradientColors: ['#1a0b2e', '#0d0221'],
    textColor: '#ffffff',
    accentColor: '#ff006e',
    fontFamily: 'Inter',
  },
  {
    id: 'electric-blue',
    name: 'Электрический синий',
    backgroundColor: '#0a1628',
    gradientColors: ['#1a2847', '#0a1628'],
    textColor: '#ffffff',
    accentColor: '#00d9ff',
    fontFamily: 'Inter',
  },
  {
    id: 'synthwave',
    name: 'Синтвейв',
    backgroundColor: '#2b0a3d',
    gradientColors: ['#4a1259', '#2b0a3d'],
    textColor: '#ffffff',
    accentColor: '#ff00ff',
    fontFamily: 'Inter',
  },

  // ========== ПРИРОДНЫЕ ТОНА ==========
  {
    id: 'forest-green',
    name: 'Лесной зелёный',
    backgroundColor: '#1b3a2f',
    gradientColors: ['#2d5447', '#1b3a2f'],
    textColor: '#ffffff',
    accentColor: '#7fdb8e',
    fontFamily: 'Inter',
  },
  {
    id: 'earth-brown',
    name: 'Земляной коричневый',
    backgroundColor: '#4a3428',
    gradientColors: ['#5c4637', '#4a3428'],
    textColor: '#ffffff',
    accentColor: '#d4a373',
    fontFamily: 'Inter',
  },
  {
    id: 'ocean-teal',
    name: 'Океанский бирюзовый',
    backgroundColor: '#0d3d56',
    gradientColors: ['#1a5570', '#0d3d56'],
    textColor: '#ffffff',
    accentColor: '#4dd0e1',
    fontFamily: 'Inter',
  },
  {
    id: 'sunset-orange',
    name: 'Закатный оранжевый',
    backgroundColor: '#5a2a0a',
    gradientColors: ['#7a3c14', '#5a2a0a'],
    textColor: '#ffffff',
    accentColor: '#ffa726',
    fontFamily: 'Inter',
  },

  // ========== ПРЕМИУМ И РОСКОШЬ ==========
  {
    id: 'royal-purple',
    name: 'Королевский пурпурный',
    backgroundColor: '#1a0a2e',
    gradientColors: ['#2d1650', '#1a0a2e'],
    textColor: '#ffffff',
    accentColor: '#e0b0ff',
    fontFamily: 'Inter',
  },
  {
    id: 'luxury-black',
    name: 'Роскошный чёрный',
    backgroundColor: '#0a0a0a',
    gradientColors: ['#1a1a1a', '#0a0a0a'],
    textColor: '#ffffff',
    accentColor: '#ffd700',
    fontFamily: 'Inter',
  },
  {
    id: 'champagne-gold',
    name: 'Шампань золотой',
    backgroundColor: '#2a2315',
    gradientColors: ['#3d3420', '#2a2315'],
    textColor: '#ffffff',
    accentColor: '#d4af37',
    fontFamily: 'Inter',
  },
  {
    id: 'pearl-white',
    name: 'Жемчужный белый',
    backgroundColor: '#fdfefe',
    gradientColors: ['#f8f9fa', '#fdfefe'],
    textColor: '#2c3e50',
    accentColor: '#b8b8b8',
    fontFamily: 'Inter',
  },

  // ========== ЯРКИЕ И ЭНЕРГИЧНЫЕ ==========
  {
    id: 'vibrant-red',
    name: 'Яркий красный',
    backgroundColor: '#b71c1c',
    gradientColors: ['#c62828', '#b71c1c'],
    textColor: '#ffffff',
    accentColor: '#ffcdd2',
    fontFamily: 'Inter',
  },
  {
    id: 'sunny-yellow',
    name: 'Солнечный жёлтый',
    backgroundColor: '#f9a825',
    gradientColors: ['#fbc02d', '#f9a825'],
    textColor: '#1a1a1a',
    accentColor: '#fff59d',
    fontFamily: 'Inter',
  },
  {
    id: 'energetic-orange',
    name: 'Энергичный оранжевый',
    backgroundColor: '#e65100',
    gradientColors: ['#ef6c00', '#e65100'],
    textColor: '#ffffff',
    accentColor: '#ffcc80',
    fontFamily: 'Inter',
  },
  {
    id: 'lime-green',
    name: 'Лаймовый зелёный',
    backgroundColor: '#689f38',
    gradientColors: ['#7cb342', '#689f38'],
    textColor: '#ffffff',
    accentColor: '#dcedc8',
    fontFamily: 'Inter',
  },

  // ========== СОВРЕМЕННЫЕ ГРАДИЕНТЫ ==========
  {
    id: 'purple-blue',
    name: 'Фиолетово-синий градиент',
    backgroundColor: '#667eea',
    gradientColors: ['#667eea', '#764ba2'],
    textColor: '#ffffff',
    accentColor: '#c3cffe',
    fontFamily: 'Inter',
  },
  {
    id: 'pink-orange',
    name: 'Розово-оранжевый градиент',
    backgroundColor: '#f093fb',
    gradientColors: ['#f093fb', '#f5576c'],
    textColor: '#ffffff',
    accentColor: '#ffd6e7',
    fontFamily: 'Inter',
  },
  {
    id: 'blue-cyan',
    name: 'Сине-циановый градиент',
    backgroundColor: '#4facfe',
    gradientColors: ['#4facfe', '#00f2fe'],
    textColor: '#1a1a1a',
    accentColor: '#e0f7ff',
    fontFamily: 'Inter',
  },

  // ========== МЯГКИЕ ПАСТЕЛЬНЫЕ ==========
  {
    id: 'pastel-pink',
    name: 'Пастельный розовый',
    backgroundColor: '#ffe5ec',
    gradientColors: ['#ffc2d1', '#ffe5ec'],
    textColor: '#3d3d3d',
    accentColor: '#ff69b4',
    fontFamily: 'Inter',
  },
  {
    id: 'pastel-blue',
    name: 'Пастельный голубой',
    backgroundColor: '#e8f4f8',
    gradientColors: ['#d1ecf1', '#e8f4f8'],
    textColor: '#2c3e50',
    accentColor: '#4299e1',
    fontFamily: 'Inter',
  },
  {
    id: 'pastel-mint',
    name: 'Пастельный мятный',
    backgroundColor: '#e8f5e9',
    gradientColors: ['#c8e6c9', '#e8f5e9'],
    textColor: '#2d3d2d',
    accentColor: '#4caf50',
    fontFamily: 'Inter',
  },
];

export function getTemplateByColor(hexColor: string): SlideTemplate {
  // Try to find matching template
  const template = SLIDE_TEMPLATES.find(
    (t) => t.backgroundColor.toLowerCase() === hexColor.toLowerCase()
  );

  if (template) return template;

  // Create custom template from color
  const isLight = isLightColor(hexColor);
  return {
    id: 'custom',
    name: 'Custom',
    backgroundColor: hexColor,
    textColor: isLight ? '#212529' : '#ffffff',
    accentColor: isLight ? '#6c5ce7' : '#00d9ff',
    fontFamily: 'Inter',
  };
}

function isLightColor(hex: string): boolean {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 128;
}

export function getRandomTemplate(): SlideTemplate {
  return SLIDE_TEMPLATES[Math.floor(Math.random() * SLIDE_TEMPLATES.length)];
}

export function getTemplateForSlideIndex(index: number, total: number): SlideTemplate {
  // Use consistent template for the carousel but vary slightly
  const baseIndex = 0; // Start with dark-purple
  return SLIDE_TEMPLATES[baseIndex];
}
