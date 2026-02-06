import sharp from 'sharp';
import { getTemplateByColor, SLIDE_TEMPLATES } from './templates';
import type { SlideData, VisualMethod } from '@/types/carousel';
import { generateBackground, isKieEnabled } from '@/lib/ai/kie-client';
import { createFullSlidePrompt } from '@/lib/ai/prompts';

// Instagram carousel dimensions
const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1080;

interface GenerateSlideOptions {
  slide: SlideData;
  templateId?: string;
  visualMethod?: VisualMethod;
  topic?: string;
  totalSlides?: number;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateSlideWithAiBackground(
  options: GenerateSlideOptions
): Promise<Buffer> {
  const { slide, topic = 'business', totalSlides = 5 } = options;

  console.log('[AI Generation] Creating full slide with text for slide', slide.order);

  // Создаём промпт для генерации полного слайда с текстом
  const prompt = createFullSlidePrompt(
    {
      order: slide.order,
      title: slide.title,
      content: slide.content,
      emoji: slide.emoji,
      backgroundColor: slide.backgroundColor,
    },
    topic,
    totalSlides
  );

  console.log('[AI Generation] Prompt:', prompt.substring(0, 200) + '...');

  // Генерируем слайд через nano-banana
  const imageUrl = await generateBackground(prompt);
  const slideBuffer = await downloadImage(imageUrl);

  // Приводим к нужному размеру (если вдруг AI сгенерировала другой размер)
  const result = await sharp(slideBuffer)
    .resize(SLIDE_WIDTH, SLIDE_HEIGHT, { fit: 'cover' })
    .png()
    .toBuffer();

  console.log('[AI Generation] Slide generated successfully');

  return result;
}

export async function generateSlideImage(
  options: GenerateSlideOptions
): Promise<Buffer> {
  const { slide, templateId, visualMethod = 'template' } = options;

  // Use AI background if requested and enabled
  if (visualMethod === 'ai' && isKieEnabled()) {
    return generateSlideWithAiBackground(options);
  }

  // Fallback to template-based generation
  // Get template
  const template = templateId
    ? SLIDE_TEMPLATES.find((t) => t.id === templateId) || SLIDE_TEMPLATES[0]
    : slide.backgroundColor
    ? getTemplateByColor(slide.backgroundColor)
    : SLIDE_TEMPLATES[0];

  // Calculate text positions
  const titleLines = wrapText(slide.title, 25);
  const contentLines = wrapText(slide.content, 40);

  // Build title tspans
  const titleStartY = slide.emoji ? 480 : 420;
  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="540" dy="${i === 0 ? 0 : 70}">${escapeXml(line)}</tspan>`
    )
    .join('');

  // Build content tspans
  const contentStartY = titleStartY + titleLines.length * 70 + 50;
  const contentTspans = contentLines
    .map(
      (line, i) =>
        `<tspan x="540" dy="${i === 0 ? 0 : 45}">${escapeXml(line)}</tspan>`
    )
    .join('');

  // Generate gradient if needed
  const gradientDef = template.gradientColors
    ? `<defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${template.gradientColors[0]}" />
          <stop offset="100%" style="stop-color:${template.gradientColors[1]}" />
        </linearGradient>
      </defs>`
    : '';

  const bgFill = template.gradientColors
    ? 'url(#bg-gradient)'
    : template.backgroundColor;

  // Create SVG
  const svg = `
    <svg width="${SLIDE_WIDTH}" height="${SLIDE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      ${gradientDef}

      <!-- Background -->
      <rect width="100%" height="100%" fill="${bgFill}" />

      <!-- Decorative circles -->
      <circle cx="200" cy="150" r="100" fill="rgba(255,255,255,0.03)" />
      <circle cx="880" cy="300" r="150" fill="rgba(255,255,255,0.02)" />
      <circle cx="150" cy="800" r="120" fill="rgba(255,255,255,0.025)" />
      <circle cx="900" cy="900" r="80" fill="rgba(255,255,255,0.02)" />

      <!-- Slide number badge -->
      <circle cx="80" cy="80" r="35" fill="rgba(255,255,255,0.15)" />
      <text x="80" y="80" text-anchor="middle" dominant-baseline="central"
            font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${template.textColor}">
        ${slide.order}
      </text>

      ${
        slide.emoji
          ? `
      <!-- Emoji -->
      <text x="540" y="380" text-anchor="middle" font-size="80">
        ${slide.emoji}
      </text>
      `
          : ''
      }

      <!-- Title -->
      <text x="540" y="${titleStartY}" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="${template.textColor}">
        ${titleTspans}
      </text>

      <!-- Content -->
      <text x="540" y="${contentStartY}" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="32" fill="${template.textColor}" opacity="0.85">
        ${contentTspans}
      </text>

      <!-- Accent line -->
      <rect x="500" y="1000" width="80" height="4" fill="${template.accentColor}" />
    </svg>
  `;

  // Generate image with sharp
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return buffer;
}

interface GenerateAllSlidesOptions {
  slides: SlideData[];
  templateId?: string;
  visualMethod?: VisualMethod;
  topic?: string;
}

export async function generateAllSlides(
  slides: SlideData[],
  options?: Omit<GenerateAllSlidesOptions, 'slides'> | string
): Promise<Buffer[]> {
  // Support legacy signature: generateAllSlides(slides, templateId)
  const opts: Omit<GenerateAllSlidesOptions, 'slides'> =
    typeof options === 'string' ? { templateId: options } : options || {};

  const { templateId, visualMethod = 'template', topic } = opts;
  const totalSlides = slides.length;

  const images: Buffer[] = [];

  for (const slide of slides) {
    const buffer = await generateSlideImage({
      slide,
      templateId,
      visualMethod,
      topic,
      totalSlides,
    });
    images.push(buffer);
  }

  return images;
}
