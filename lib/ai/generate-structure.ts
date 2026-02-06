import { openai, MODELS } from './openai-client';
import {
  MARKET_ANALYSIS_PROMPT,
  STRUCTURE_GENERATION_PROMPT,
  REFERENCE_ANALYSIS_PROMPT,
  SLIDE_REGENERATION_PROMPT,
} from './prompts';
import type { CarouselStructure, SlideData, StylePreset } from '@/types/carousel';
import { getStylePromptHint } from '@/lib/styles/presets';

interface GenerateStructureInput {
  slideCount: number;
  businessTheme: string;
  leadMagnet: string;
  codeWord: string;
  referenceAnalysis?: string;
  stylePreset?: StylePreset;
}

export async function analyzeMarket(businessTheme: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: MODELS.fast,
    messages: [
      { role: 'system', content: MARKET_ANALYSIS_PROMPT },
      {
        role: 'user',
        content: `Тема бизнеса: ${businessTheme}`,
      },
    ],
    max_tokens: 800,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || '';
}

export async function analyzeReference(
  imageBase64: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: MODELS.smart,
    messages: [
      { role: 'system', content: REFERENCE_ANALYSIS_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
          {
            type: 'text',
            text: 'Проанализируй этот референс карусели',
          },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0.5,
  });

  return response.choices[0]?.message?.content || '';
}

export async function generateStructure(
  input: GenerateStructureInput,
  marketAnalysis: string
): Promise<CarouselStructure> {
  // Get style instructions based on selected preset
  const styleHint = input.stylePreset
    ? getStylePromptHint(input.stylePreset)
    : 'Используй спокойные профессиональные цвета.';

  const userMessage = `
Данные от пользователя:
- Количество слайдов: ${input.slideCount}
- Тема бизнеса: ${input.businessTheme}
- Лид-магнит: ${input.leadMagnet}
- Кодовое слово для получения лид-магнита: ${input.codeWord}

Анализ рынка:
${marketAnalysis}

${input.referenceAnalysis ? `Анализ референса (ПРИОРИТЕТ для цветов!):\n${input.referenceAnalysis}\n\nВАЖНО: Используй цвета из референса для backgroundColor каждого слайда!` : ''}

СТИЛЬ ОФОРМЛЕНИЯ (для backgroundColor):
${input.referenceAnalysis ? 'Приоритет: цвета из референса выше. Если цвета не указаны явно — ' + styleHint : styleHint}

Создай структуру карусели из ${input.slideCount} слайдов.
ВАЖНО: На последнем слайде ОБЯЗАТЕЛЬНО используй кодовое слово "${input.codeWord}" в призыве к действию!
Например: "Напиши «${input.codeWord}» в директ и получи..."
`;

  const response = await openai.chat.completions.create({
    model: MODELS.smart,
    messages: [
      { role: 'system', content: STRUCTURE_GENERATION_PROMPT },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 2000,
    temperature: 0.8,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content) as CarouselStructure;

  // Ensure slides have correct order
  parsed.slides = parsed.slides.map((slide, index) => ({
    ...slide,
    order: index + 1,
  }));

  // Ensure final slide has CTA with code word
  if (parsed.slides.length > 0) {
    const lastSlide = parsed.slides[parsed.slides.length - 1];
    const codeWordLower = input.codeWord.toLowerCase();
    const hasCodeWordInTitle = lastSlide.title.toLowerCase().includes(codeWordLower);
    const hasCodeWordInContent = lastSlide.content.toLowerCase().includes(codeWordLower);

    if (!hasCodeWordInTitle && !hasCodeWordInContent) {
      // Add CTA with code word to last slide
      parsed.slides[parsed.slides.length - 1] = {
        ...lastSlide,
        content: `${lastSlide.content}\n\nНапиши «${input.codeWord}» в директ и получи ${input.leadMagnet} бесплатно!`,
      };
    }
  }

  // Ensure CTA field has code word
  if (parsed.cta && !parsed.cta.toLowerCase().includes(input.codeWord.toLowerCase())) {
    parsed.cta = `Напиши «${input.codeWord}» в директ и получи ${input.leadMagnet} бесплатно!`;
  }

  return parsed;
}

export async function regenerateSlide(
  slideIndex: number,
  currentSlide: SlideData,
  context: { topic: string; targetAudience: string }
): Promise<SlideData> {
  const prompt = SLIDE_REGENERATION_PROMPT.replace('{title}', currentSlide.title)
    .replace('{content}', currentSlide.content)
    .replace('{topic}', context.topic)
    .replace('{targetAudience}', context.targetAudience);

  const response = await openai.chat.completions.create({
    model: MODELS.fast,
    messages: [
      { role: 'user', content: prompt },
    ],
    max_tokens: 300,
    temperature: 0.9,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);

  return {
    order: currentSlide.order,
    title: parsed.title || currentSlide.title,
    content: parsed.content || currentSlide.content,
    visualPrompt: parsed.visualPrompt || currentSlide.visualPrompt,
    backgroundColor: currentSlide.backgroundColor,
    emoji: parsed.emoji || currentSlide.emoji,
  };
}
