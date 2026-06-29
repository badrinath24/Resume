import { createServerClient } from './supabase';

// Fallback keys from environment (used if user hasn't saved their own)
export const FALLBACK_OPENAI_KEY = process.env.OPENAI_API_KEY ?? '';
export const FALLBACK_NVIDIA_KEY = process.env.NVIDIA_API_KEY ?? '';

export interface UserKeys {
  openai_api_key?: string | null;
  nvidia_api_key?: string | null;
  nvidia_write_key?: string | null;
}

export async function getUserKeys(userId: string): Promise<UserKeys> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('users')
    .select('openai_api_key, nvidia_api_key, nvidia_write_key')
    .eq('id', userId)
    .single();
  return data ?? {};
}

// Pick the best key for parsing tasks: OpenAI > NVIDIA parse key > env fallbacks
export function getParseKey(keys: UserKeys): { key: string; provider: 'openai' | 'nvidia' } | null {
  if (keys.openai_api_key) return { key: keys.openai_api_key, provider: 'openai' };
  if (keys.nvidia_api_key) return { key: keys.nvidia_api_key, provider: 'nvidia' };
  if (FALLBACK_OPENAI_KEY) return { key: FALLBACK_OPENAI_KEY, provider: 'openai' };
  if (FALLBACK_NVIDIA_KEY) return { key: FALLBACK_NVIDIA_KEY, provider: 'nvidia' };
  return null;
}

// Pick the best key for writing tasks: OpenAI > NVIDIA write key > NVIDIA parse key > env fallbacks
export function getWriteKey(keys: UserKeys): { key: string; provider: 'openai' | 'nvidia' } | null {
  if (keys.openai_api_key) return { key: keys.openai_api_key, provider: 'openai' };
  if (keys.nvidia_write_key) return { key: keys.nvidia_write_key, provider: 'nvidia' };
  if (keys.nvidia_api_key) return { key: keys.nvidia_api_key, provider: 'nvidia' };
  if (FALLBACK_OPENAI_KEY) return { key: FALLBACK_OPENAI_KEY, provider: 'openai' };
  if (FALLBACK_NVIDIA_KEY) return { key: FALLBACK_NVIDIA_KEY, provider: 'nvidia' };
  return null;
}

export async function callAI(
  keyInfo: { key: string; provider: 'openai' | 'nvidia' },
  prompt: string,
  opts: { temperature?: number; maxTokens?: number; timeoutMs?: number; isWriting?: boolean } = {}
): Promise<string> {
  const temperature = opts.temperature ?? 0.2;
  const maxTokens = opts.maxTokens ?? 2000;
  const timeoutMs = opts.timeoutMs ?? 50000;

  if (keyInfo.provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${keyInfo.key}` },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? '';
  } else {
    const model = opts.isWriting ? 'meta/llama-3.3-70b-instruct' : 'meta/llama-3.1-70b-instruct';
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${keyInfo.key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new Error(`NVIDIA ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? '';
  }
}

export function extractJSON(raw: string): any {
  try {
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleaned);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through */ }
    }
    return {};
  }
}
