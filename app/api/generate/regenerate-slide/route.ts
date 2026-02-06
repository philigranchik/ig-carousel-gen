import { NextRequest, NextResponse } from 'next/server';
import { regenerateSlide } from '@/lib/ai/generate-structure';
import type { SlideData } from '@/types/carousel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slideIndex, currentSlide, context } = body as {
      slideIndex: number;
      currentSlide: SlideData;
      context: { topic: string; targetAudience: string };
    };

    if (slideIndex === undefined || !currentSlide || !context) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    const newSlide = await regenerateSlide(slideIndex, currentSlide, context);

    return NextResponse.json({ slide: newSlide });
  } catch (error) {
    console.error('Slide regeneration error:', error);
    return NextResponse.json(
      { error: 'Ошибка при перегенерации слайда' },
      { status: 500 }
    );
  }
}
