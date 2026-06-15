import OpenAI from 'openai';
import { createServerClient } from './supabase';

export const DEFAULT_MODEL = 'meta/llama-3.1-70b-instruct';
export const FALLBACK_KEY = process.env.NVIDIA_FALLBACK_KEY ?? process.env.NVIDIA_API_KEY;

export function getAIClient(apiKey: string) {
  return new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey,
  });
}

export async function getUserApiKey(userId: string): Promise<string | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('users')
    .select('nvidia_api_key')
    .eq('id', userId)
    .single();
  return data?.nvidia_api_key ?? null;
}
