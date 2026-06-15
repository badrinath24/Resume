export const maxDuration = 120;

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserApiKey, PARSE_KEY } from '@/lib/nvidia';
import { getResumeParserPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const title = (formData.get('title') as string) ?? 'My Resume';
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  let rawText = '';

  if (file.name.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    rawText = (await mammoth.extractRawText({ buffer })).value;
  } else {
    const pdfParse = (await import('pdf-parse')).default;
    rawText = (await pdfParse(buffer)).text;
  }

  const warning = rawText.length < 200;
  const truncated = rawText.slice(0, 8000);
  const userKey = await getUserApiKey(userId);
  const apiKey = userKey ?? PARSE_KEY;

  const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'qwen/qwen3-next-80b-a3b-instruct',  // fast sparse MoE — best for extraction
      messages: [{ role: 'user', content: getResumeParserPrompt(truncated) }],
      temperature: 0.1,
      max_tokens: 2000,
      stream: false,
    }),
    signal: AbortSignal.timeout(90000),
  });

  if (!nvidiaRes.ok) {
    const errText = await nvidiaRes.text();
    console.error('NVIDIA error:', nvidiaRes.status, errText);
    return NextResponse.json({ error: `AI error: ${nvidiaRes.status}` }, { status: 500 });
  }

  const nvidiaJson = await nvidiaRes.json();
  const raw = nvidiaJson.choices?.[0]?.message?.content ?? '{}';
  console.log('NVIDIA raw (first 200):', raw.slice(0, 200));

  let parsedData: any = {};
  try { parsedData = JSON.parse(raw.trim()); } catch { parsedData = {}; }

  const supabase = createServerClient();

  // Ensure user row exists (Clerk webhook may not have fired yet)
  await supabase.from('users').upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true });

  const { data, error } = await supabase.from('resumes').insert({
    user_id: userId,
    title,
    raw_text: rawText,
    personal_info: parsedData.personal ?? {},
    summary: parsedData.summary ?? '',
    experience: parsedData.experience ?? [],
    education: parsedData.education ?? [],
    skills: parsedData.skills ?? [],
    certifications: parsedData.certifications ?? [],
    languages: parsedData.languages ?? [],
    is_master: true,
  }).select('id').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id, parsedData, warning });
}
