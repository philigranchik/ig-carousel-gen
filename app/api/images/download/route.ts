import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carouselId = searchParams.get('carouselId');

    if (!carouselId) {
      return NextResponse.json(
        { error: 'carouselId обязателен' },
        { status: 400 }
      );
    }

    const dir = path.join(process.cwd(), 'public', 'generated', carouselId);

    // Check if directory exists
    try {
      await fs.access(dir);
    } catch {
      return NextResponse.json(
        { error: 'Карусель не найдена' },
        { status: 404 }
      );
    }

    // Get all PNG files
    const files = await fs.readdir(dir);
    const pngFiles = files.filter((f) => f.endsWith('.png'));

    if (pngFiles.length === 0) {
      return NextResponse.json(
        { error: 'Изображения не найдены' },
        { status: 404 }
      );
    }

    // If single file, return it directly
    if (pngFiles.length === 1) {
      const filePath = path.join(dir, pngFiles[0]);
      const buffer = await fs.readFile(filePath);

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${pngFiles[0]}"`,
        },
      });
    }

    // For multiple files, create a simple response with URLs
    // (Full ZIP support would require additional setup)
    const urls = pngFiles.map((f) => `/generated/${carouselId}/${f}`);

    return NextResponse.json({ files: urls });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Ошибка при скачивании' },
      { status: 500 }
    );
  }
}
