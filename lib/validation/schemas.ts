import { z } from 'zod';

export const carouselFormSchema = z.object({
  slideCount: z
    .number()
    .min(1, 'Минимум 1 слайд')
    .max(10, 'Максимум 10 слайдов'),
  businessTheme: z
    .string()
    .min(5, 'Минимум 5 символов')
    .max(200, 'Максимум 200 символов'),
  leadMagnet: z
    .string()
    .min(5, 'Минимум 5 символов')
    .max(300, 'Максимум 300 символов'),
  codeWord: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(30, 'Максимум 30 символов')
    .regex(/^[A-ZА-ЯЁa-zа-яё0-9_]+$/, 'Только буквы, цифры и _'),
  reference: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 5 * 1024 * 1024; // 5MB
      },
      'Файл должен быть меньше 5MB'
    )
    .refine(
      (file) => {
        if (!file) return true;
        return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      },
      'Поддерживаются только JPG, PNG, WEBP'
    ),
  visualMethod: z.enum(['template', 'ai', 'comfyui']),
  stylePreset: z.enum(['pastel', 'dark-professional', 'bright-contrast', 'minimal', 'gradient-modern']),
});

export type CarouselFormInput = z.infer<typeof carouselFormSchema>;

// Схема для структуры карусели (от AI)
export const slideDataSchema = z.object({
  order: z.number(),
  title: z.string().max(80),
  content: z.string().max(200),
  visualPrompt: z.string(),
  backgroundColor: z.string().optional(),
  emoji: z.string().optional(),
});

export const carouselStructureSchema = z.object({
  topic: z.string(),
  targetAudience: z.string(),
  hook: z.string(),
  slides: z.array(slideDataSchema),
  cta: z.string(),
});

export type SlideDataInput = z.infer<typeof slideDataSchema>;
export type CarouselStructureInput = z.infer<typeof carouselStructureSchema>;
