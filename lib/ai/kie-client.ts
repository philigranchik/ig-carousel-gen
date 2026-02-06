const KIE_API_BASE = 'https://api.kie.ai/api/v1/jobs';

interface KieTaskResponse {
  code: number;
  message: string;
  data: {
    taskId: string;
  };
}

interface KieTaskResult {
  code: number;
  message: string;
  data: {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    output?: {
      image_url?: string;
      images?: string[];
    };
    error?: string;
  };
}

export async function createImageTask(prompt: string): Promise<string> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey || apiKey === 'your_kie_api_key_here') {
    throw new Error('KIE_API_KEY не настроен. Проверьте файл .env.local');
  }

  console.log('[Kie.ai] Creating task with prompt:', prompt.substring(0, 100) + '...');

  const response = await fetch(`${KIE_API_BASE}/createTask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/nano-banana',
      input: {
        prompt,
        image_size: '1:1',
        output_format: 'png',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[Kie.ai] API error:', response.status, error);
    throw new Error(`Kie.ai API ошибка (${response.status}): ${error}`);
  }

  const result: KieTaskResponse = await response.json();
  console.log('[Kie.ai] Task response:', JSON.stringify(result));

  if (result.code !== 0 && result.code !== 200) {
    const errorMessage = result.message || `код ошибки ${result.code}`;
    console.error('[Kie.ai] Task creation failed:', errorMessage);
    throw new Error(`Kie.ai: ${errorMessage}`);
  }

  console.log('[Kie.ai] Task created:', result.data.taskId);
  return result.data.taskId;
}

export async function getTaskResult(taskId: string): Promise<string> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    throw new Error('KIE_API_KEY не настроен');
  }

  const response = await fetch(
    `${KIE_API_BASE}/getTaskDetails?taskId=${taskId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  if (!response.ok) {
    console.error('[Kie.ai] Failed to get task details:', response.status);
    throw new Error(`Kie.ai: ошибка получения статуса (${response.status})`);
  }

  const result: KieTaskResult = await response.json();
  console.log('[Kie.ai] Task status:', result.data.status);

  if (result.data.status === 'failed') {
    console.error('[Kie.ai] Generation failed:', result.data.error);
    throw new Error(`Kie.ai: генерация не удалась - ${result.data.error || 'неизвестная ошибка'}`);
  }

  if (result.data.status !== 'completed') {
    throw new Error('PENDING');
  }

  const imageUrl =
    result.data.output?.image_url ||
    result.data.output?.images?.[0];

  if (!imageUrl) {
    console.error('[Kie.ai] No image URL in response:', result.data.output);
    throw new Error('Kie.ai: изображение не получено');
  }

  console.log('[Kie.ai] Got image URL');
  return imageUrl;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateBackground(
  prompt: string,
  maxAttempts = 30,
  pollInterval = 2000
): Promise<string> {
  console.log('[Kie.ai] Starting background generation...');

  const taskId = await createImageTask(prompt);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const imageUrl = await getTaskResult(taskId);
      console.log('[Kie.ai] Background generated successfully after', attempt + 1, 'attempts');
      return imageUrl;
    } catch (error) {
      if (error instanceof Error && error.message === 'PENDING') {
        if (attempt % 5 === 0) {
          console.log('[Kie.ai] Still processing... attempt', attempt + 1);
        }
        await sleep(pollInterval);
        continue;
      }
      console.error('[Kie.ai] Error during generation:', error);
      throw error;
    }
  }

  console.error('[Kie.ai] Timed out after', maxAttempts, 'attempts');
  throw new Error('Kie.ai: превышено время ожидания генерации');
}

export function isKieEnabled(): boolean {
  return (
    process.env.KIE_AI_ENABLED === 'true' &&
    !!process.env.KIE_API_KEY &&
    process.env.KIE_API_KEY !== 'your_kie_api_key_here'
  );
}
