import { NextRequest, NextResponse } from 'next/server';
import { generateStructure } from '@/lib/ai/generate-structure';
import { carouselStructureSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slideCount,
      businessTheme,
      leadMagnet,
      codeWord,
      marketAnalysis,
      referenceAnalysis,
      stylePreset,
    } = body;

    if (!slideCount || !businessTheme || !leadMagnet || !codeWord || !marketAnalysis) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    const structure = await generateStructure(
      {
        slideCount,
        businessTheme,
        leadMagnet,
        codeWord,
        referenceAnalysis,
        stylePreset,
      },
      marketAnalysis
    );

    // Validate the structure
    const validation = carouselStructureSchema.safeParse(structure);
    if (!validation.success) {
      console.error('Structure validation failed:', validation.error);
      // Return anyway, but log the error
    }

    return NextResponse.json({ structure });
  } catch (error) {
    console.error('Structure generation error:', error);
    return NextResponse.json(
      { error: 'Ошибка при генерации структуры. Попробуйте еще раз.' },
      { status: 500 }
    );
  }
}
