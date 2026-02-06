export type VisualMethod = 'template' | 'ai' | 'comfyui';

export type StylePreset = 'pastel' | 'dark-professional' | 'bright-contrast' | 'minimal' | 'gradient-modern';

export interface StylePresetConfig {
  id: StylePreset;
  name: string;
  description: string;
  colors: string[]; // Example colors for preview
  aiPromptHint: string; // Instructions for AI on color selection
}

export interface CarouselFormData {
  slideCount: number;
  businessTheme: string;
  leadMagnet: string;
  codeWord: string;
  reference?: File;
  visualMethod: VisualMethod;
  stylePreset: StylePreset;
}

export interface SlideData {
  order: number;
  title: string;
  content: string;
  visualPrompt: string;
  backgroundColor?: string;
  emoji?: string;
}

export interface CarouselStructure {
  topic: string;
  targetAudience: string;
  hook: string;
  slides: SlideData[];
  cta: string;
}

export interface GeneratedSlide {
  order: number;
  imageUrl: string;
  imagePath: string;
  title: string;
  content: string;
}

export interface Carousel {
  id: string;
  createdAt: string;
  formData: CarouselFormData;
  marketAnalysis?: string;
  referenceAnalysis?: string;
  structure: CarouselStructure;
  generatedSlides: GeneratedSlide[];
  instagramPostId?: string;
  instagramPostUrl?: string;
  status: 'draft' | 'generated' | 'posted';
}

export type GenerationStep =
  | 'input'
  | 'analyzing'
  | 'structure'
  | 'structure_preview'
  | 'generating_visuals'
  | 'finalizing'
  | 'preview'
  | 'posting'
  | 'completed';

export interface GenerationProgress {
  step: GenerationStep;
  progress: number; // 0-100
  message: string;
  currentSlide?: number;
  totalSlides?: number;
}
