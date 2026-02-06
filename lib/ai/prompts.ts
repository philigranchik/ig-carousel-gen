export const MARKET_ANALYSIS_PROMPT = `Ты — эксперт по маркетингу в Instagram и созданию вирусного контента.

Проанализируй рынок для данной темы бизнеса. Изучи:
1. Какие боли и желания есть у целевой аудитории
2. Какие форматы каруселей работают лучше всего в этой нише
3. Какие хуки (первые слайды) привлекают внимание
4. Какие призывы к действию конвертируют лучше всего
5. Какие визуальные стили популярны (цвета, настроение, энергетика)

ВИЗУАЛЬНЫЙ АНАЛИЗ:
- Определи эмоциональный тон ниши (серьёзный/игривый, премиум/доступный, энергичный/спокойный)
- Какие цветовые гаммы резонируют с этой аудиторией?
- Примеры: финансы любят тёмные/премиум цвета, коучи — пастельные, молодёжь — неоновые

Дай краткий, но полезный анализ (200-350 слов), который поможет создать эффективную карусель с правильным визуальным стилем.`;

export const STRUCTURE_GENERATION_PROMPT = `Ты — профессиональный копирайтер для Instagram, специализирующийся на создании вирусных каруселей.

На основе анализа рынка и данных пользователя создай структуру карусели.

ВАЖНЫЕ ПРАВИЛА:
1. Первый слайд — мощный хук, который останавливает скролл (вопрос или провокация)
2. Каждый слайд должен давать ценность и заставлять листать дальше
3. Контент должен быть ПОДРОБНЫМ и ИНФОРМАТИВНЫМ:
   - Заголовок: до 60 символов (ёмкий, но понятный)
   - Контент: 80-150 символов (раскрывает тему, даёт конкретику, цифры, примеры)
4. ПОСЛЕДНИЙ СЛАЙД — ОБЯЗАТЕЛЬНО призыв к действию с кодовым словом:
   - Натуральный переход от контента к предложению
   - Чётко объясни что получит пользователь (лид-магнит)
   - Призови написать КОДОВОЕ СЛОВО в директ
   - Пример: "Хочешь полный гайд? Напиши «СЛОВО» в директ и получи бесплатно!"
5. Используй эмодзи умеренно, только где уместно
6. Делай контент образовательным — давай реальную пользу на каждом слайде
7. Используй списки, цифры, конкретные примеры в контенте

СТРУКТУРА КАРУСЕЛИ:
- Слайд 1: Хук (вопрос/проблема, которая цепляет ЦА)
- Слайды 2-N-1: Полезный контент (шаги, советы, инсайты с деталями)
- Слайд N (последний): CTA с кодовым словом для получения лид-магнита

ВИЗУАЛЬНОЕ ОФОРМЛЕНИЕ:
Для каждого слайда выбирай backgroundColor и visualPrompt, учитывая тему и аудиторию:

ПРИОРИТЕТ ЦВЕТОВ:
1. Если есть анализ референса с цветами — используй ТОЛЬКО эти цвета!
2. Если референса нет — выбирай цвета из указанного стиля, но адаптируй под контент:
   - Для серьёзных/деловых тем: тёмные профессиональные (#1e2328, #2c3e50, #3d3d3d)
   - Для молодёжи/креатива: яркие/неоновые (#bf00ff, #ff006e, #00d9ff)
   - Для коучинга/психологии: пастельные (#ffe5ec, #e8f4f8, #e8f5e9)
   - Для финансов/премиум: роскошные (#1a0a2e, #0a0a0a с золотом)
   - Для экологии/природы: природные тона (#1b3a2f, #4a3428, #0d3d56)
   - Для энергичных тем: яркие (#b71c1c, #f9a825, #e65100)

РАЗНООБРАЗИЕ:
- Чередуй цвета между слайдами для динамичности (не все слайды одного цвета!)
- Первый слайд должен быть самым ярким/цепляющим
- Последний слайд (CTA) — тёплый/располагающий к действию
- Средние слайды — стабильные, не отвлекающие от контента

Для каждого слайда укажи:
- order: номер слайда
- title: заголовок (крупный текст, до 60 символов)
- content: основной текст (80-150 символов, подробный и полезный)
- visualPrompt: описание для генерации фона (на английском, для AI генератора изображений)
- backgroundColor: HEX цвет фона (следуй правилам выше!)
- emoji: главный эмодзи для слайда (опционально)

Ответь в формате JSON:
{
  "topic": "краткое название темы",
  "targetAudience": "описание ЦА",
  "hook": "почему эта карусель зацепит",
  "slides": [...],
  "cta": "призыв к действию с кодовым словом"
}`;

export const REFERENCE_ANALYSIS_PROMPT = `Проанализируй этот референс карусели из Instagram.

ВАЖНО: Извлеки и укажи конкретные цвета!

Опиши:
1. ЦВЕТА (ОБЯЗАТЕЛЬНО укажи HEX коды!):
   - Основной цвет фона: #XXXXXX
   - Дополнительные цвета: #XXXXXX, #XXXXXX
   - Цвет акцентов: #XXXXXX
2. Визуальный стиль (шрифты, композиция)
3. Структура контента (как построен текст)
4. Что делает этот дизайн привлекательным

Ответь в формате:
ЦВЕТА: основной #XXXXXX, дополнительные #XXXXXX, #XXXXXX, акцент #XXXXXX
СТИЛЬ: [описание стиля]
КОНТЕНТ: [как построен текст]
РЕКОМЕНДАЦИИ: [как использовать]`;

export function createBackgroundPrompt(
  visualPrompt: string,
  topic: string,
  slideNumber: number,
  totalSlides: number
): string {
  const isFirstSlide = slideNumber === 1;
  const isLastSlide = slideNumber === totalSlides;

  let basePrompt = visualPrompt;

  if (!basePrompt || basePrompt.length < 10) {
    basePrompt = `Abstract gradient background for ${topic}`;
  }

  const styleGuidelines = [
    'minimalist design',
    'suitable for text overlay',
    'Instagram carousel style',
    'no text or letters',
    'clean and modern',
    'professional aesthetic',
  ];

  // Добавляем разнообразие в зависимости от позиции слайда
  if (isFirstSlide) {
    styleGuidelines.push(
      'attention-grabbing',
      'bold dynamic colors',
      'high contrast',
      'eye-catching gradient'
    );
  } else if (isLastSlide) {
    styleGuidelines.push(
      'call to action vibe',
      'warm inviting tones',
      'encouraging atmosphere',
      'soft welcoming gradient'
    );
  } else {
    // Средние слайды — более спокойные
    styleGuidelines.push(
      'balanced composition',
      'smooth gradients',
      'calm professional look'
    );
  }

  return `${basePrompt}, ${styleGuidelines.join(', ')}, square format 1:1`;
}

export function createFullSlidePrompt(
  slide: {
    order: number;
    title: string;
    content: string;
    emoji?: string;
    backgroundColor?: string;
  },
  topic: string,
  totalSlides: number
): string {
  const isFirstSlide = slide.order === 1;
  const isLastSlide = slide.order === totalSlides;

  let styleDescription = '';
  if (isFirstSlide) {
    styleDescription = 'attention-grabbing, bold dynamic colors, high contrast, eye-catching';
  } else if (isLastSlide) {
    styleDescription = 'warm inviting tones, encouraging atmosphere, call to action vibe';
  } else {
    styleDescription = 'balanced composition, calm professional look, smooth colors';
  }

  const colorHint = slide.backgroundColor ? `background color ${slide.backgroundColor}` : 'vibrant gradient background';

  return `Create an Instagram carousel slide (1080x1080px, square format 1:1) with text overlay.

VISUAL STYLE:
- ${styleDescription}
- Modern minimalist design
- Professional Instagram aesthetic
- ${colorHint}
- Clean typography with excellent readability

TEXT CONTENT TO DISPLAY:
- Slide number in top-left corner: "${slide.order}"
${slide.emoji ? `- Emoji in center-top area: "${slide.emoji}"` : ''}
- Main title (large, bold, center): "${slide.title}"
- Content text (medium size, below title): "${slide.content}"
- Small accent line at bottom

LAYOUT:
- Slide number badge: top-left, circular background
- ${slide.emoji ? 'Emoji: center-top, large size' : 'No emoji'}
- Title: center, large bold font (56px), white or dark text (depends on background)
- Content: below title, medium font (32px), slightly transparent, well-spaced lines
- Accent line: bottom center, thin horizontal line

IMPORTANT:
- Text must be clearly readable with good contrast
- All text in Russian language exactly as provided
- Professional Instagram carousel style
- No other elements, keep it clean and focused`;
}

export const SLIDE_REGENERATION_PROMPT = `Перегенерируй текст для слайда карусели.

Текущий слайд:
- Заголовок: {title}
- Контент: {content}

Контекст карусели:
- Тема: {topic}
- Целевая аудитория: {targetAudience}

Создай альтернативную версию этого слайда, сохранив смысл но изменив подачу.
Ответь в JSON: { "title": "...", "content": "...", "visualPrompt": "...", "emoji": "..." }`;
