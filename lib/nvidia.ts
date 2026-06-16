import { createServerClient } from './supabase';

// PARSE_KEY — used for resume parsing and job description parsing (read/extract tasks)
export const PARSE_KEY = process.env.NVIDIA_API_KEY ?? process.env.NVIDIA_FALLBACK_KEY ?? '';

// WRITE_KEY — used for tailoring, cover letter, ATS scoring (generation tasks)
export const WRITE_KEY = process.env.NVIDIA_FALLBACK_KEY ?? process.env.NVIDIA_API_KEY ?? '';

export async function getUserApiKey(userId: string): Promise<string | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('users')
    .select('nvidia_api_key')
    .eq('id', userId)
    .single();
  return data?.nvidia_api_key ?? null;
}
