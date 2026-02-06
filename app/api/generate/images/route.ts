import { NextRequest, NextResponse } from 'next/server';
import { generateAllSlides } from '@/lib/images/generate-slide-image';
import type { SlideData, VisualMethod } from '@/types/carousel';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slides, templateId, visualMethod, topic } = body as {
      slides: SlideData[];
      templateId?: string;
      visualMethod?: VisualMethod;
      topic?: string;
    };

    if (!slides || slides.length === 0) {
      return NextResponse.json(
        { error: 'Слайды обязательны' },
        { status: 400 }
      );
    }

    // Generate images
    const imageBuffers = await generateAllSlides(slides, {
      templateId,
      visualMethod,
      topic,
    });

    // Save to public folder for serving
    const carouselId = uuidv4();
    const outputDir = path.join(process.cwd(), 'public', 'generated', carouselId);
    await fs.mkdir(outputDir, { recursive: true });

    const generatedSlides = await Promise.all(
      imageBuffers.map(async (buffer, index) => {
        const filename = `slide-${index + 1}.png`;
        const filePath = path.join(outputDir, filename);
        await fs.writeFile(filePath, buffer);

        return {
          order: index + 1,
          imageUrl: `/generated/${carouselId}/${filename}`,
          imagePath: filePath,
          title: slides[index].title,
          content: slides[index].content,
        };
      })
    );

    return NextResponse.json({
      carouselId,
      slides: generatedSlides,
    });
  } catch (error) {
    console.error('Image generation error:', error);

    // Extract meaningful error message
    let errorMessage = 'Ошибка при генерации изображений';
    if (error instanceof Error) {
      if (error.message.includes('Kie.ai')) {
        errorMessage = error.message;
      } else if (error.message.includes('timed out') || error.message.includes('timeout')) {
        errorMessage = 'Превышено время ожидания AI генерации. Попробуйте использовать шаблоны.';
      } else if (error.message.includes('API')) {
        errorMessage = `Ошибка AI сервиса: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
