import { NextRequest, NextResponse } from 'next/server';
import { analyzeMarket, analyzeReference } from '@/lib/ai/generate-structure';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const businessTheme = formData.get('businessTheme') as string;
    const referenceFile = formData.get('reference') as File | null;

    if (!businessTheme) {
      return NextResponse.json(
        { error: 'Тема бизнеса обязательна' },
        { status: 400 }
      );
    }

    // Analyze market
    const marketAnalysis = await analyzeMarket(businessTheme);

    // Analyze reference if provided
    let referenceAnalysis: string | null = null;
    if (referenceFile) {
      const bytes = await referenceFile.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      referenceAnalysis = await analyzeReference(base64);
    }

    return NextResponse.json({
      marketAnalysis,
      referenceAnalysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Ошибка при анализе. Попробуйте еще раз.' },
      { status: 500 }
    );
  }
}
