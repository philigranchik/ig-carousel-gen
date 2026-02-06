import { create } from 'zustand';
import type {
  CarouselFormData,
  CarouselStructure,
  GeneratedSlide,
  GenerationStep,
  GenerationProgress,
  SlideData,
} from '@/types/carousel';

interface CarouselState {
  // Form data
  formData: CarouselFormData | null;
  referenceFile: File | null;
  referencePreview: string | null;

  // Generation state
  step: GenerationStep;
  progress: GenerationProgress;
  isLoading: boolean;
  error: string | null;

  // Results
  marketAnalysis: string | null;
  referenceAnalysis: string | null;
  structure: CarouselStructure | null;
  generatedSlides: GeneratedSlide[];

  // Actions
  setFormData: (data: CarouselFormData) => void;
  setReferenceFile: (file: File | null, preview?: string | null) => void;
  setStep: (step: GenerationStep) => void;
  setProgress: (progress: Partial<GenerationProgress>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMarketAnalysis: (analysis: string) => void;
  setReferenceAnalysis: (analysis: string) => void;
  setStructure: (structure: CarouselStructure) => void;
  updateSlide: (index: number, data: Partial<SlideData>) => void;
  regenerateSlide: (index: number) => Promise<void>;
  setGeneratedSlides: (slides: GeneratedSlide[]) => void;
  addGeneratedSlide: (slide: GeneratedSlide) => void;
  reset: () => void;
  goBack: () => void;
}

const initialProgress: GenerationProgress = {
  step: 'input',
  progress: 0,
  message: '',
};

const initialState = {
  formData: null,
  referenceFile: null,
  referencePreview: null,
  step: 'input' as GenerationStep,
  progress: initialProgress,
  isLoading: false,
  error: null,
  marketAnalysis: null,
  referenceAnalysis: null,
  structure: null,
  generatedSlides: [],
};

export const useCarouselStore = create<CarouselState>((set, get) => ({
  ...initialState,

  setFormData: (data) => set({ formData: data }),

  setReferenceFile: (file, preview = null) =>
    set({ referenceFile: file, referencePreview: preview }),

  setStep: (step) =>
    set({
      step,
      progress: { ...get().progress, step },
    }),

  setProgress: (progress) =>
    set({ progress: { ...get().progress, ...progress } }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  setMarketAnalysis: (marketAnalysis) => set({ marketAnalysis }),

  setReferenceAnalysis: (referenceAnalysis) => set({ referenceAnalysis }),

  setStructure: (structure) => set({ structure }),

  updateSlide: (index, data) => {
    const { structure } = get();
    if (!structure) return;

    const updatedSlides = [...structure.slides];
    updatedSlides[index] = { ...updatedSlides[index], ...data };

    set({
      structure: { ...structure, slides: updatedSlides },
    });
  },

  regenerateSlide: async (index) => {
    // Will be implemented with API call
    console.log('Regenerating slide', index);
  },

  setGeneratedSlides: (generatedSlides) => set({ generatedSlides }),

  addGeneratedSlide: (slide) =>
    set({ generatedSlides: [...get().generatedSlides, slide] }),

  reset: () => set(initialState),

  goBack: () => {
    const { step } = get();
    const stepOrder: GenerationStep[] = [
      'input',
      'analyzing',
      'structure',
      'structure_preview',
      'generating_visuals',
      'finalizing',
      'preview',
    ];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      // Can go back from structure_preview to input
      if (step === 'structure_preview') {
        set({ step: 'input', isLoading: false, error: null });
      }
    }
  },
}));
