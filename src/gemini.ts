import { GoogleGenAI } from '@google/genai';

export const AI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
] as const;

export type AiModel = typeof AI_MODELS[number];

export function getApiKey(): string {
  return localStorage.getItem('gemini_api_key') || '';
}

export function getSelectedModel(): AiModel {
  const saved = localStorage.getItem('gemini_selected_model') as AiModel;
  if (saved && AI_MODELS.includes(saved)) {
    return saved;
  }
  return AI_MODELS[0];
}

export async function generateAiResponse(prompt: string, fallbackModels: AiModel[] = [...AI_MODELS]): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Bạn chưa cấu hình API Key cho hệ thống. Hãy nhấp vào Cài đặt (Settings) ở góc trên để điền nhé!');
  }

  // Use selected model first, then shift through fallbacks if it fails.
  const userSelected = getSelectedModel();
  
  // Arrange models: userSelected first, then remaining fallbacks
  const availableModels = fallbackModels.includes(userSelected) 
    ? [userSelected, ...fallbackModels.filter(m => m !== userSelected)]
    : fallbackModels;

  let lastError: any = null;

  for (const model of availableModels) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      if (response.text) {
        return response.text;
      }
    } catch (error: any) {
      console.warn(`[AI] Model ${model} failed:`, error);
      lastError = error;
      
      // If it's a critical auth error, don't fallback, just throw immediately
      if (error.message?.includes('API_KEY_INVALID') || error.status === 400 || error.status === 403) {
        throw new Error(`Lỗi xác thực API Key: ${error.message}`);
      }
      // If quota exceeded or other errors (429 RESOURCE_EXHAUSTED), we continue to next model
    }
  }

  // If all models failed
  const errorMsg = lastError?.message || lastError || 'Lỗi không xác định';
  throw new Error(`Tất cả các model AI đều thất bại. Lỗi cuối cùng: ${errorMsg}`);
}
